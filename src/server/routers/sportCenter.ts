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
import { isSysAdmin } from "../../services/rbacService";
import {
  publicProcedure,
  router,
  tenantAdminProcedure,
  tenantStaffProcedure,
} from "../trpc";
import { requireTenantId } from "../utils/tenant";

const IdSchema = z.union([z.string().uuid(), z.string().cuid()]);

const createSportCenterSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  district: z.string().optional(),
  city: z.string().optional().default("Lima"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  description: z.string().optional(),
  images: z.array(z.string().url("URL de imagen inválida")).default([]),
  ownerId: IdSchema.optional(), // Solo para admin, asignar a otro usuario
});

const updateSportCenterSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  ownerId: IdSchema.optional(),
});

export const sportCenterRouter = router({
  // Listar centros deportivos del tenant (TENANT_STAFF o superior)
  list: tenantStaffProcedure
    .input(paginationInputSchema.optional())
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

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
        "address",
        "district",
        "description",
      ]);
      const orderBy = createSortOrder(sortBy, sortOrder, {
        name: "name",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      });

      // SYS_ADMIN puede ver todos los sport centers, otros solo los de su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);

      const whereClause: Prisma.SportCenterWhereInput = {
        ...(!isSys && { tenantId }),
        ...searchFilter,
      };

      const [sportCenters, total] = await Promise.all([
        prisma.sportCenter.findMany({
          where: whereClause,
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                fields: true,
              },
            },
          },
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.sportCenter.count({
          where: whereClause,
        }),
      ]);

      return createPaginatedResponse(sportCenters, total, page, limit);
    }),

  // Obtener centro deportivo por ID (TENANT_STAFF o superior)
  getById: tenantStaffProcedure
    .input(z.object({ id: IdSchema }))
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const sportCenter = await prisma.sportCenter.findUnique({
        where: { id: input.id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          fields: {
            select: {
              id: true,
              name: true,
              sport: true,
              price: true,
              available: true,
            },
            orderBy: {
              name: "asc",
            },
          },
        },
      });

      if (!sportCenter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Centro deportivo no encontrado",
        });
      }

      // SYS_ADMIN puede ver cualquier sport center, otros solo los de su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);
      if (!isSys && sportCenter.tenantId !== tenantId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver este centro deportivo",
        });
      }

      return sportCenter;
    }),

  // Crear centro deportivo (solo TENANT_ADMIN)
  create: tenantAdminProcedure
    .input(createSportCenterSchema)
    .mutation(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      // Determinar el ownerId
      const ownerId = input.ownerId || ctx.user.id;

      // Si se especificó un ownerId diferente, verificar que pertenece al tenant
      if (input.ownerId && input.ownerId !== ctx.user.id) {
        const ownerUser = await prisma.user.findUnique({
          where: { id: input.ownerId },
        });

        if (!ownerUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "El usuario propietario no existe",
          });
        }

        if (ownerUser.tenantId !== tenantId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "El usuario propietario no pertenece al mismo tenant",
          });
        }
      }

      const sportCenter = await prisma.sportCenter.create({
        data: {
          name: input.name,
          slug: `${input.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
          address: input.address,
          district: input.district,
          city: input.city,
          phone: input.phone,
          email: input.email || null,
          description: input.description,
          images: input.images,
          tenantId,
          ownerId: ownerId,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              fields: true,
            },
          },
        },
      });

      return sportCenter;
    }),

  // Actualizar centro deportivo (solo TENANT_ADMIN)
  update: tenantAdminProcedure
    .input(updateSportCenterSchema)
    .mutation(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const existingSportCenter = await prisma.sportCenter.findUnique({
        where: { id: input.id },
        select: { id: true, tenantId: true },
      });

      if (!existingSportCenter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Centro deportivo no encontrado",
        });
      }

      // SYS_ADMIN puede actualizar cualquier sport center, TENANT_ADMIN solo los de su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);
      if (!isSys && existingSportCenter.tenantId !== tenantId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para actualizar este centro deportivo",
        });
      }

      // Si se está cambiando el owner, verificar que pertenece al tenant
      if (input.ownerId) {
        const newOwner = await prisma.user.findUnique({
          where: { id: input.ownerId },
        });

        if (!newOwner) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "El usuario propietario no existe",
          });
        }

        if (!isSys && newOwner.tenantId !== tenantId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "El usuario propietario no pertenece al mismo tenant",
          });
        }
      }

      const updateData: Prisma.SportCenterUpdateInput = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.address !== undefined) updateData.address = input.address;
      if (input.district !== undefined) updateData.district = input.district;
      if (input.city !== undefined) updateData.city = input.city;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.email !== undefined) updateData.email = input.email || null;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.images !== undefined) updateData.images = input.images;
      if (input.ownerId !== undefined) {
        updateData.owner = {
          connect: { id: input.ownerId },
        };
      }

      const sportCenter = await prisma.sportCenter.update({
        where: { id: input.id },
        data: updateData,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              fields: true,
            },
          },
        },
      });

      return sportCenter;
    }),

  // Eliminar centro deportivo (solo TENANT_ADMIN)
  delete: tenantAdminProcedure
    .input(z.object({ id: IdSchema }))
    .mutation(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const existingSportCenter = await prisma.sportCenter.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          tenantId: true,
          _count: {
            select: {
              fields: true,
            },
          },
        },
      });

      if (!existingSportCenter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Centro deportivo no encontrado",
        });
      }

      // SYS_ADMIN puede eliminar cualquier sport center, TENANT_ADMIN solo los de su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);
      if (!isSys && existingSportCenter.tenantId !== tenantId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para eliminar este centro deportivo",
        });
      }

      // Verificar si tiene canchas asociadas
      if (existingSportCenter._count.fields > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `No se puede eliminar el centro deportivo porque tiene ${existingSportCenter._count.fields} cancha(s) asociada(s)`,
        });
      }

      await prisma.sportCenter.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        message: "Centro deportivo eliminado correctamente",
      };
    }),

  // Listar centros deportivos públicos (para clientes)
  listPublic: publicProcedure
    .input(
      z
        .object({
          page: z.number().min(1).optional(),
          limit: z.number().min(1).max(50).optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { page = 1, limit = 12, search } = input ?? {};
      const offset = (page - 1) * limit;

      const where: Prisma.SportCenterWhereInput = {
        ...(search?.trim() && {
          OR: [
            { name: { contains: search.trim(), mode: "insensitive" } },
            { district: { contains: search.trim(), mode: "insensitive" } },
            { city: { contains: search.trim(), mode: "insensitive" } },
          ],
        }),
      };

      const [sportCenters, total] = await Promise.all([
        prisma.sportCenter.findMany({
          where,
          select: {
            id: true,
            name: true,
            address: true,
            district: true,
            city: true,
            description: true,
            images: true,
            _count: {
              select: {
                fields: true,
              },
            },
          },
          orderBy: { name: "asc" },
          skip: offset,
          take: limit,
        }),
        prisma.sportCenter.count({ where }),
      ]);

      return {
        data: sportCenters,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),
});
