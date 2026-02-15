import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/db";
import {
  calculateOffset,
  createPaginatedResponse,
  createSearchFilter,
  createSortOrder,
  paginationInputSchema,
} from "../../lib/pagination";
import { seedTenantRolesAndPermissions } from "../seedTenant";
import {
  router,
  sysAdminProcedure,
  tenantAdminProcedure,
  tenantStaffProcedure,
} from "../trpc";

const TenantPlanEnum = z.enum(["FREE", "BASIC", "PROFESSIONAL", "ENTERPRISE"]);

const createTenantSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  slug: z
    .string()
    .min(1, "Slug requerido")
    .regex(/^[a-z0-9-]+$/, "Slug debe ser lowercase, números y guiones"),
  displayName: z.string().min(1, "Nombre para mostrar requerido"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  plan: TenantPlanEnum.optional().default("FREE"),
  maxFields: z.number().int().positive().optional().default(5),
  maxUsers: z.number().int().positive().optional().default(10),
  // Admin user credentials
  adminEmail: z.string().email("Email del administrador requerido"),
  adminName: z.string().min(1, "Nombre del administrador requerido"),
  adminPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const updateTenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  displayName: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  plan: TenantPlanEnum.optional(),
  maxFields: z.number().int().positive().optional(),
  maxUsers: z.number().int().positive().optional(),
  isVerified: z.boolean().optional(),
});

export const tenantRouter = router({
  // Listar tenants con paginación y filtros (SYS_ADMIN)
  list: sysAdminProcedure
    .input(paginationInputSchema.optional())
    .query(async ({ input }) => {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy,
        sortOrder = "desc",
      } = input || {};

      const offset = calculateOffset(page, limit);
      const searchFilter = createSearchFilter(search, [
        "name",
        "displayName",
        "email",
      ]);
      const orderBy = createSortOrder(sortBy, sortOrder, {
        name: "name",
        displayName: "displayName",
        createdAt: "createdAt",
      });

      const whereClause: Prisma.TenantWhereInput = {
        ...searchFilter,
      };

      const [tenants, total] = await Promise.all([
        prisma.tenant.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            slug: true,
            displayName: true,
            email: true,
            phone: true,
            plan: true,
            maxFields: true,
            maxUsers: true,
            isActive: true,
            isVerified: true,
            createdAt: true,
            _count: {
              select: {
                users: true,
                fields: true,
              },
            },
          },
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.tenant.count({
          where: whereClause,
        }),
      ]);

      return createPaginatedResponse(tenants, total, page, limit);
    }),

  // Obtener tenant por ID con detalles completos (SYS_ADMIN)
  getById: sysAdminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const tenant = await prisma.tenant.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              users: true,
              fields: true,
              roles: true,
              permissions: true,
            },
          },
        },
      });

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant no encontrado",
        });
      }

      return tenant;
    }),

  // Crear tenant con usuario administrador inicial (SYS_ADMIN)
  create: sysAdminProcedure
    .input(createTenantSchema)
    .mutation(async ({ input }) => {
      // Verificar que el slug no exista
      const existingSlug = await prisma.tenant.findUnique({
        where: { slug: input.slug },
      });

      if (existingSlug) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "El slug ya está en uso",
        });
      }

      // Verificar que el email del admin no exista
      const existingUser = await prisma.user.findUnique({
        where: { email: input.adminEmail },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "El email del administrador ya está registrado",
        });
      }

      // Crear tenant y usuario admin en una transacción
      const result = await prisma.$transaction(async (tx) => {
        // 1. Crear el tenant
        const tenant = await tx.tenant.create({
          data: {
            name: input.name,
            slug: input.slug,
            displayName: input.displayName,
            email: input.email || undefined,
            phone: input.phone,
            website: input.website || undefined,
            plan: input.plan,
            maxFields: input.maxFields,
            maxUsers: input.maxUsers,
          },
        });

        // 2. Crear roles y permisos del tenant
        await seedTenantRolesAndPermissions(tenant.id);

        // 3. Crear usuario administrador (con hash de password)
        // Nota: Aquí deberías usar tu sistema de auth (Better Auth) para crear el usuario
        // Por ahora solo creamos el registro en la BD
        const adminUser = await tx.user.create({
          data: {
            email: input.adminEmail,
            username: `${input.adminEmail.split("@")[0]}_${Date.now()}`,
            name: input.adminName,
            emailVerified: false,
            tenantId: tenant.id,
          },
        });

        // 4. Asignar rol TENANT_ADMIN al usuario
        const tenantAdminRole = await tx.role.findUnique({
          where: {
            name_tenantId: {
              name: "tenant_admin",
              tenantId: tenant.id,
            },
          },
        });

        if (tenantAdminRole) {
          await tx.userRole.create({
            data: {
              userId: adminUser.id,
              roleId: tenantAdminRole.id,
            },
          });
        }

        return { tenant, adminUser };
      });

      return result.tenant;
    }),

  // Actualizar tenant (SYS_ADMIN puede actualizar cualquiera, TENANT_ADMIN solo el suyo)
  update: tenantAdminProcedure
    .input(updateTenantSchema)
    .mutation(async ({ input, ctx }) => {
      const existingTenant = await prisma.tenant.findUnique({
        where: { id: input.id },
      });

      if (!existingTenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant no encontrado",
        });
      }

      // TENANT_ADMIN solo puede actualizar su propio tenant
      if (ctx.user.tenantId !== input.id) {
        // Verificar si es SYS_ADMIN
        if (!ctx.user.roles.includes("sys_admin")) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Solo puedes actualizar tu propio tenant",
          });
        }
      }

      // Si se está cambiando el slug, verificar que no exista
      if (input.slug && input.slug !== existingTenant.slug) {
        const existingSlug = await prisma.tenant.findUnique({
          where: { slug: input.slug },
        });

        if (existingSlug) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "El slug ya está en uso",
          });
        }
      }

      const updateData: Prisma.TenantUpdateInput = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.displayName !== undefined)
        updateData.displayName = input.displayName;
      if (input.email !== undefined) updateData.email = input.email || null;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.website !== undefined)
        updateData.website = input.website || null;
      if (input.plan !== undefined) updateData.plan = input.plan;
      if (input.maxFields !== undefined) updateData.maxFields = input.maxFields;
      if (input.maxUsers !== undefined) updateData.maxUsers = input.maxUsers;

      // Solo SYS_ADMIN puede cambiar isVerified
      if (
        input.isVerified !== undefined &&
        ctx.user.roles.includes("sys_admin")
      ) {
        updateData.isVerified = input.isVerified;
        if (input.isVerified && !existingTenant.verifiedAt) {
          updateData.verifiedAt = new Date();
        }
      }

      const tenant = await prisma.tenant.update({
        where: { id: input.id },
        data: updateData,
        include: {
          _count: {
            select: {
              users: true,
              fields: true,
            },
          },
        },
      });

      return tenant;
    }),

  // Eliminar tenant (solo SYS_ADMIN)
  delete: sysAdminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const existingTenant = await prisma.tenant.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              users: true,
              fields: true,
            },
          },
        },
      });

      if (!existingTenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant no encontrado",
        });
      }

      // Verificar si tiene usuarios o canchas
      if (existingTenant._count.users > 0 || existingTenant._count.fields > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `No se puede eliminar el tenant porque tiene ${existingTenant._count.users} usuario(s) y ${existingTenant._count.fields} cancha(s)`,
        });
      }

      await prisma.tenant.delete({
        where: { id: input.id },
      });

      return { success: true, message: "Tenant eliminado correctamente" };
    }),

  // Obtener mi tenant (TENANT_STAFF o superior)
  getMyTenant: tenantStaffProcedure.query(async ({ ctx }) => {
    if (!ctx.user.tenantId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuario sin tenant asignado",
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: ctx.user.tenantId },
      include: {
        _count: {
          select: {
            users: true,
            fields: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Tenant no encontrado",
      });
    }

    return tenant;
  }),

  // Obtener estadísticas del tenant (TENANT_ADMIN o SYS_ADMIN con id)
  getStats: tenantAdminProcedure
    .input(z.object({ id: z.string().uuid().optional() }).optional())
    .query(async ({ input, ctx }) => {
      // Si no se proporciona ID, usar el tenant del usuario
      const tenantId = input?.id || ctx.user.tenantId;

      if (!tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      // TENANT_ADMIN solo puede ver stats de su propio tenant
      if (
        tenantId !== ctx.user.tenantId &&
        !ctx.user.roles.includes("sys_admin")
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Solo puedes ver estadísticas de tu propio tenant",
        });
      }

      const [totalUsers, totalFields, totalReservations, totalRevenue] =
        await Promise.all([
          prisma.user.count({ where: { tenantId } }),
          prisma.field.count({ where: { tenantId } }),
          prisma.reservation.count({
            where: {
              field: { tenantId },
            },
          }),
          prisma.reservation.aggregate({
            where: {
              field: { tenantId },
              status: { in: ["CONFIRMED", "COMPLETED"] },
            },
            _sum: {
              amount: true,
            },
          }),
        ]);

      return {
        totalUsers,
        totalFields,
        totalReservations,
        totalRevenue: Number(totalRevenue._sum.amount ?? 0),
      };
    }),

  // Activar/desactivar tenant (solo SYS_ADMIN)
  toggleActive: sysAdminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const tenant = await prisma.tenant.findUnique({
        where: { id: input.id },
        select: { id: true, isActive: true },
      });

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant no encontrado",
        });
      }

      const updatedTenant = await prisma.tenant.update({
        where: { id: input.id },
        data: { isActive: !tenant.isActive },
        select: {
          id: true,
          name: true,
          displayName: true,
          isActive: true,
        },
      });

      return updatedTenant;
    }),
});
