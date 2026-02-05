import { Prisma } from "@prisma/client";
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
import {
  hasPermissionOrManage,
  hasRole,
  isAdmin,
} from "../../services/rbacService";
import { PermissionAction, PermissionResource } from "../../types/rbac";
import { protectedProcedure, publicProcedure, router } from "../trpc";

// IDs en este proyecto pueden ser UUID o CUID (ej: "cmkye...").
// Usamos un schema único para evitar errores de "Invalid uuid".
const IdSchema = z.union([z.string().uuid(), z.string().cuid()]);

// Enum de deportes
const SportEnum = z.enum([
  "FOOTBALL",
  "TENNIS",
  "BASKETBALL",
  "VOLLEYBALL",
  "FUTSAL",
]);

// Schema para crear una cancha
const createFieldSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  sport: SportEnum,
  price: z.number().positive("El precio debe ser mayor a 0"),
  available: z.boolean().default(true),
  images: z.array(z.string().url("URL de imagen inválida")).default([]),
  address: z.string().min(1, "La dirección es requerida"),
  city: z.string().optional().default("Lima"),
  district: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  googleMapsUrl: z
    .string()
    .url("URL de Google Maps inválida")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  sportCenterId: IdSchema.optional(),
  ownerId: IdSchema.optional(), // Solo para admin
  features: z
    .array(
      z.object({
        featureId: IdSchema,
        value: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

// Schema para actualizar una cancha
const updateFieldSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).optional(),
  sport: SportEnum.optional(),
  price: z.number().positive().optional(),
  available: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
  address: z.string().min(1).optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  sportCenterId: IdSchema.optional(),
  ownerId: IdSchema.optional(), // Solo para admin
  features: z
    .array(
      z.object({
        featureId: IdSchema,
        value: z.string().optional(),
      })
    )
    .optional(),
});

// Helper para convertir número a Decimal de Prisma
function toDecimal(value: number | undefined): Prisma.Decimal | undefined {
  if (value === undefined) return undefined;
  return new Prisma.Decimal(value);
}

export const fieldRouter = router({
  // Crear una nueva cancha
  create: protectedProcedure
    .input(createFieldSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      // Verificar que el usuario tenga el rol owner o sea admin
      if (!ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);
      const userIsOwner = await hasRole(
        ctx.user.id,
        "owner",
        ctx.user.tenantId
      );

      if (!userIsAdmin && !userIsOwner) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Solo usuarios con rol 'owner' o administradores pueden crear canchas. Contacta a un administrador para obtener el rol de owner.",
        });
      }

      // Si no es admin, verificar permisos específicos
      if (!userIsAdmin) {
        const canCreate = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.CREATE,
          PermissionResource.FIELD,
          ctx.user.tenantId
        );

        if (!canCreate) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No tienes permisos para crear canchas",
          });
        }
      }

      // Determinar el ownerId: admin puede especificar uno, owner usa el suyo
      const ownerId =
        userIsAdmin && input.ownerId ? input.ownerId : ctx.user.id;

      // Si admin especificó un ownerId, verificar que existe y pertenece al mismo tenant
      if (userIsAdmin && input.ownerId) {
        const ownerUser = await prisma.user.findUnique({
          where: { id: input.ownerId },
        });

        if (!ownerUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "El usuario propietario no existe",
          });
        }

        if (ownerUser.tenantId !== ctx.user.tenantId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "El usuario propietario no pertenece al mismo tenant",
          });
        }
      }

      // Verificar que el sportCenter existe si se proporciona
      if (input.sportCenterId) {
        const sportCenter = await prisma.sportCenter.findUnique({
          where: { id: input.sportCenterId },
        });

        if (!sportCenter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Centro deportivo no encontrado",
          });
        }

        // Verificar que el sportCenter pertenece al mismo owner (o admin puede asignarlo)
        if (!userIsAdmin && sportCenter.ownerId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "El centro deportivo no te pertenece",
          });
        }
      }

      // Crear la cancha
      const priceDecimal = toDecimal(input.price);
      if (!priceDecimal) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El precio es requerido",
        });
      }

      // Verificar que las features existen si se proporcionan
      if (input.features && input.features.length > 0) {
        const featureIds = input.features.map((f) => f.featureId);
        const existingFeatures = await prisma.feature.findMany({
          where: {
            id: { in: featureIds },
            isActive: true,
          },
        });

        if (existingFeatures.length !== featureIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Una o más características no existen o están inactivas",
          });
        }
      }

      const field = await prisma.$transaction(async (tx) => {
        const createdField = await tx.field.create({
          data: {
            name: input.name,
            sport: input.sport,
            price: priceDecimal,
            available: input.available,
            images: input.images,
            address: input.address,
            city: input.city,
            district: input.district,
            latitude: toDecimal(input.latitude),
            longitude: toDecimal(input.longitude),
            googleMapsUrl: input.googleMapsUrl || null,
            description: input.description,
            phone: input.phone,
            email: input.email || null,
            owner: {
              connect: { id: ownerId },
            },
            ...(input.sportCenterId && {
              sportCenter: {
                connect: { id: input.sportCenterId },
              },
            }),
          },
        });

        // Crear fieldFeatures si se proporcionan
        if (input.features && input.features.length > 0) {
          await tx.fieldFeature.createMany({
            data: input.features.map((f) => ({
              fieldId: createdField.id,
              featureId: f.featureId,
              value: f.value || null,
            })),
          });
        }

        return createdField;
      });

      // Obtener el field completo con relaciones
      const fieldWithRelations = await prisma.field.findUnique({
        where: { id: field.id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          sportCenter: {
            select: {
              id: true,
              name: true,
            },
          },
          schedules: true,
          fieldFeatures: {
            include: {
              feature: true,
            },
          },
        },
      });

      if (!fieldWithRelations) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No se pudo obtener la cancha recién creada",
        });
      }
      return fieldWithRelations;
    }),

  // Obtener todas las canchas (owner ve solo las suyas, admin ve todas)
  getAll: protectedProcedure
    .input(
      paginationInputSchema
        .extend({
          sport: SportEnum.optional(),
          available: z.boolean().optional(),
          search: z.string().optional(),
          ownerId: z.union([IdSchema, z.literal("")]).optional(), // UUID/CUID o vacío
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      // Verificar si es admin
      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);
      const userIsOwner = await hasRole(
        ctx.user.id,
        "owner",
        ctx.user.tenantId
      );

      // Verificar permisos para leer canchas
      if (!userIsAdmin) {
        const canRead = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.READ,
          PermissionResource.FIELD,
          ctx.user.tenantId
        );

        if (!canRead && !userIsOwner) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No tienes permisos para ver canchas",
          });
        }
      }

      const {
        page = 1,
        limit = 10,
        search,
        sortBy,
        sortOrder = "desc",
        sport,
        available,
        ownerId,
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
        price: "price",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      });

      // Construir filtros
      // Admin puede ver todas las canchas del tenant o filtrar por ownerId
      // Owner solo ve sus propias canchas
      const whereClause: Prisma.FieldWhereInput = {
        ...(userIsAdmin
          ? ownerId && ownerId !== ""
            ? { ownerId } // Admin puede filtrar por owner específico
            : {
                // Admin ve todas las canchas del tenant (filtro por owner.tenantId)
                owner: {
                  tenantId: ctx.user.tenantId,
                },
              }
          : { ownerId: ctx.user.id }), // Owner solo ve sus canchas
        ...searchFilter,
        ...(sport && { sport }),
        ...(available !== undefined && { available }),
      };

      const [fields, total] = await Promise.all([
        prisma.field.findMany({
          where: whereClause,
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            sportCenter: {
              select: {
                id: true,
                name: true,
              },
            },
            schedules: true,
            fieldFeatures: {
              include: {
                feature: true,
              },
            },
            _count: {
              select: {
                reservations: true,
              },
            },
          },
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.field.count({
          where: whereClause,
        }),
      ]);

      return createPaginatedResponse(fields, total, page, limit);
    }),

  // Obtener una cancha por ID
  getById: protectedProcedure
    .input(z.object({ id: IdSchema }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      const field = await prisma.field.findUnique({
        where: { id: input.id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              tenantId: true,
            },
          },
          sportCenter: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
          schedules: {
            orderBy: {
              day: "asc",
            },
          },
          fieldFeatures: {
            include: {
              feature: true,
            },
          },
          _count: {
            select: {
              reservations: true,
            },
          },
          reservations: {
            include: {
              payments: true,
              user: { select: { name: true } },
            },
            orderBy: {
              startDate: "desc",
            },
            take: 100,
          },
        },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      // Verificar multi-tenant: la cancha debe pertenecer al mismo tenant
      if (field.owner.tenantId !== ctx.user.tenantId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver esta cancha",
        });
      }

      // Verificar permisos: admin puede ver cualquier cancha del tenant, owner solo las suyas
      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);

      if (!userIsAdmin && field.ownerId !== ctx.user.id) {
        const canRead = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.READ,
          PermissionResource.FIELD,
          ctx.user.tenantId
        );

        if (!canRead) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No tienes permisos para ver esta cancha",
          });
        }
      }

      return field;
    }),

  // Actualizar una cancha
  update: protectedProcedure
    .input(updateFieldSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      // Verificar que la cancha existe
      const existingField = await prisma.field.findUnique({
        where: { id: input.id },
      });

      if (!existingField) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      // Verificar permisos: admin puede actualizar cualquier cancha, owner solo las suyas
      if (!ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);

      if (!userIsAdmin && existingField.ownerId !== ctx.user.id) {
        const canUpdate = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.FIELD,
          ctx.user.tenantId
        );

        if (!canUpdate) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No tienes permisos para actualizar esta cancha",
          });
        }
      }

      // Si admin está cambiando el owner, verificar que el nuevo owner existe
      if (input.ownerId && userIsAdmin) {
        const newOwner = await prisma.user.findUnique({
          where: { id: input.ownerId },
        });

        if (!newOwner) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "El usuario propietario no existe",
          });
        }

        // Verificar que el nuevo owner pertenece al mismo tenant
        if (newOwner.tenantId !== ctx.user.tenantId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "El usuario propietario no pertenece al mismo tenant",
          });
        }
      }

      // Verificar que el sportCenter existe si se proporciona
      if (input.sportCenterId) {
        const sportCenter = await prisma.sportCenter.findUnique({
          where: { id: input.sportCenterId },
        });

        if (!sportCenter) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Centro deportivo no encontrado",
          });
        }

        // Solo verificar ownership si no es admin
        if (!userIsAdmin && sportCenter.ownerId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "El centro deportivo no te pertenece",
          });
        }
      }

      // Preparar datos de actualización
      const updateData: Prisma.FieldUpdateInput = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.sport !== undefined) updateData.sport = input.sport;
      if (input.price !== undefined) updateData.price = toDecimal(input.price);
      if (input.available !== undefined) updateData.available = input.available;
      if (input.images !== undefined) updateData.images = input.images;
      if (input.address !== undefined) updateData.address = input.address;
      if (input.city !== undefined) updateData.city = input.city;
      if (input.district !== undefined) updateData.district = input.district;
      if (input.latitude !== undefined)
        updateData.latitude = toDecimal(input.latitude);
      if (input.longitude !== undefined)
        updateData.longitude = toDecimal(input.longitude);
      if (input.googleMapsUrl !== undefined) {
        updateData.googleMapsUrl = input.googleMapsUrl || null;
      }
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.email !== undefined) {
        updateData.email = input.email || null;
      }
      if (input.sportCenterId !== undefined) {
        if (input.sportCenterId) {
          updateData.sportCenter = {
            connect: { id: input.sportCenterId },
          };
        } else {
          updateData.sportCenter = {
            disconnect: true,
          };
        }
      }

      // Solo admin puede cambiar el owner
      if (input.ownerId !== undefined && userIsAdmin) {
        updateData.owner = {
          connect: { id: input.ownerId },
        };
      }

      // Actualizar la cancha y features en una transacción
      const _updatedField = await prisma.$transaction(async (tx) => {
        // Actualizar el field
        const field = await tx.field.update({
          where: { id: input.id },
          data: updateData,
        });

        // Actualizar features si se proporcionan
        if (input.features !== undefined) {
          // Eliminar todas las features existentes
          await tx.fieldFeature.deleteMany({
            where: { fieldId: input.id },
          });

          // Verificar que las nuevas features existen
          if (input.features.length > 0) {
            const featureIds = input.features.map((f) => f.featureId);
            const existingFeatures = await tx.feature.findMany({
              where: {
                id: { in: featureIds },
                isActive: true,
              },
            });

            if (existingFeatures.length !== featureIds.length) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Una o más características no existen o están inactivas",
              });
            }

            // Crear las nuevas features
            await tx.fieldFeature.createMany({
              data: input.features.map((f) => ({
                fieldId: input.id,
                featureId: f.featureId,
                value: f.value || null,
              })),
            });
          }
        }

        return field;
      });

      // Obtener el field completo con relaciones
      const fieldWithRelations = await prisma.field.findUnique({
        where: { id: input.id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          sportCenter: {
            select: {
              id: true,
              name: true,
            },
          },
          schedules: true,
          fieldFeatures: {
            include: {
              feature: true,
            },
          },
        },
      });

      if (!fieldWithRelations) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No se pudo obtener la cancha actualizada",
        });
      }
      return fieldWithRelations;
    }),

  // Eliminar una cancha
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      // Verificar que la cancha existe
      const existingField = await prisma.field.findUnique({
        where: { id: input.id },
      });

      if (!existingField) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      // Verificar permisos: admin puede eliminar cualquier cancha, owner solo las suyas
      if (!ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);

      if (!userIsAdmin && existingField.ownerId !== ctx.user.id) {
        const canDelete = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.DELETE,
          PermissionResource.FIELD,
          ctx.user.tenantId
        );

        if (!canDelete) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No tienes permisos para eliminar esta cancha",
          });
        }
      }

      // Verificar si hay reservas activas
      const activeReservations = await prisma.reservation.count({
        where: {
          fieldId: input.id,
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
      });

      if (activeReservations > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `No se puede eliminar la cancha porque tiene ${activeReservations} reserva(s) activa(s)`,
        });
      }

      // Eliminar la cancha (cascade eliminará schedules, fieldFeatures, etc.)
      await prisma.field.delete({
        where: { id: input.id },
      });

      return { success: true, message: "Cancha eliminada correctamente" };
    }),

  // Actualizar disponibilidad de una cancha
  updateAvailability: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        available: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      // Verificar que la cancha existe
      const existingField = await prisma.field.findUnique({
        where: { id: input.id },
      });

      if (!existingField) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      // Verificar permisos: admin puede actualizar cualquier cancha, owner solo las suyas
      if (!ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);

      if (!userIsAdmin && existingField.ownerId !== ctx.user.id) {
        const canUpdate = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.FIELD,
          ctx.user.tenantId
        );

        if (!canUpdate) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No tienes permisos para actualizar esta cancha",
          });
        }
      }

      // Actualizar disponibilidad
      const updatedField = await prisma.field.update({
        where: { id: input.id },
        data: { available: input.available },
        select: {
          id: true,
          name: true,
          available: true,
        },
      });

      return updatedField;
    }),

  // Obtener horarios de una cancha
  getSchedules: protectedProcedure
    .input(z.object({ fieldId: IdSchema }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      // Verificar que la cancha existe y pertenece al owner
      const field = await prisma.field.findUnique({
        where: { id: input.fieldId },
        select: {
          id: true,
          ownerId: true,
        },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      // Verificar permisos
      if (field.ownerId !== ctx.user.id) {
        if (ctx.user.tenantId) {
          const canRead = await hasPermissionOrManage(
            ctx.user.id,
            PermissionAction.READ,
            PermissionResource.FIELD,
            ctx.user.tenantId
          );

          if (!canRead) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message:
                "No tienes permisos para ver los horarios de esta cancha",
            });
          }
        } else {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No tienes permisos para ver los horarios de esta cancha",
          });
        }
      }

      // Obtener horarios
      const schedules = await prisma.schedule.findMany({
        where: { fieldId: input.fieldId },
        orderBy: {
          day: "asc",
        },
      });

      return schedules;
    }),

  // Actualizar horarios de una cancha (bulk update)
  updateSchedules: protectedProcedure
    .input(
      z.object({
        fieldId: IdSchema,
        schedules: z.array(
          z.object({
            day: z.enum([
              "MONDAY",
              "TUESDAY",
              "WEDNESDAY",
              "THURSDAY",
              "FRIDAY",
              "SATURDAY",
              "SUNDAY",
            ]),
            startHour: z
              .string()
              .regex(
                /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
                "Formato inválido. Use HH:mm"
              ),
            endHour: z
              .string()
              .regex(
                /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
                "Formato inválido. Use HH:mm"
              ),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      // Verificar que la cancha existe y pertenece al owner
      const field = await prisma.field.findUnique({
        where: { id: input.fieldId },
        select: {
          id: true,
          ownerId: true,
        },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      // Verificar permisos: admin puede actualizar cualquier cancha, owner solo las suyas
      if (!ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);

      if (!userIsAdmin && field.ownerId !== ctx.user.id) {
        const canUpdate = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.FIELD,
          ctx.user.tenantId
        );

        if (!canUpdate) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "No tienes permisos para actualizar los horarios de esta cancha",
          });
        }
      }

      // Validar que las horas de inicio sean menores que las de fin
      for (const schedule of input.schedules) {
        const startParts = schedule.startHour.split(":");
        const endParts = schedule.endHour.split(":");

        if (startParts.length !== 2 || endParts.length !== 2) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Formato de hora inválido para ${schedule.day}`,
          });
        }

        const startHour = Number.parseInt(startParts[0] ?? "0", 10);
        const startMinute = Number.parseInt(startParts[1] ?? "0", 10);
        const endHour = Number.parseInt(endParts[0] ?? "0", 10);
        const endMinute = Number.parseInt(endParts[1] ?? "0", 10);

        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        if (startTime >= endTime) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `La hora de inicio debe ser menor que la hora de fin para ${schedule.day}`,
          });
        }
      }

      // Eliminar horarios existentes y crear nuevos
      await prisma.$transaction([
        prisma.schedule.deleteMany({
          where: { fieldId: input.fieldId },
        }),
        ...input.schedules.map((schedule) =>
          prisma.schedule.create({
            data: {
              fieldId: input.fieldId,
              day: schedule.day,
              startHour: schedule.startHour,
              endHour: schedule.endHour,
            },
          })
        ),
      ]);

      // Obtener los horarios actualizados
      const updatedSchedules = await prisma.schedule.findMany({
        where: { fieldId: input.fieldId },
        orderBy: {
          day: "asc",
        },
      });

      return updatedSchedules;
    }),

  // Crear un horario individual
  createSchedule: protectedProcedure
    .input(
      z.object({
        fieldId: IdSchema,
        day: z.enum([
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ]),
        startHour: z
          .string()
          .regex(
            /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
            "Formato inválido. Use HH:mm"
          ),
        endHour: z
          .string()
          .regex(
            /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
            "Formato inválido. Use HH:mm"
          ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      const field = await prisma.field.findUnique({
        where: { id: input.fieldId },
        select: { id: true, ownerId: true },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);
      if (!userIsAdmin && field.ownerId !== ctx.user.id) {
        const canUpdate = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.FIELD,
          ctx.user.tenantId
        );
        if (!canUpdate) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No tienes permisos para crear horarios en esta cancha",
          });
        }
      }

      // Validar horas
      const [startH, startM] = input.startHour.split(":").map(Number);
      const [endH, endM] = input.endHour.split(":").map(Number);
      const startTime = startH * 60 + startM;
      const endTime = endH * 60 + endM;

      if (startTime >= endTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "La hora de inicio debe ser menor que la hora de fin",
        });
      }

      // Verificar si ya existe un horario para este día
      const existing = await prisma.schedule.findUnique({
        where: {
          fieldId_day: {
            fieldId: input.fieldId,
            day: input.day,
          },
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Ya existe un horario para este día. Usa la opción de editar.",
        });
      }

      const schedule = await prisma.schedule.create({
        data: {
          fieldId: input.fieldId,
          day: input.day,
          startHour: input.startHour,
          endHour: input.endHour,
        },
      });

      return schedule;
    }),

  // Actualizar un horario individual
  updateSchedule: protectedProcedure
    .input(
      z.object({
        scheduleId: IdSchema,
        startHour: z
          .string()
          .regex(
            /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
            "Formato inválido. Use HH:mm"
          )
          .optional(),
        endHour: z
          .string()
          .regex(
            /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
            "Formato inválido. Use HH:mm"
          )
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      const schedule = await prisma.schedule.findUnique({
        where: { id: input.scheduleId },
        include: {
          field: {
            select: { id: true, ownerId: true },
          },
        },
      });

      if (!schedule) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Horario no encontrado",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);
      if (!userIsAdmin && schedule.field.ownerId !== ctx.user.id) {
        const canUpdate = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.FIELD,
          ctx.user.tenantId
        );
        if (!canUpdate) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No tienes permisos para actualizar este horario",
          });
        }
      }

      const startHour = input.startHour || schedule.startHour;
      const endHour = input.endHour || schedule.endHour;

      // Validar horas
      const [startH, startM] = startHour.split(":").map(Number);
      const [endH, endM] = endHour.split(":").map(Number);
      const startTime = startH * 60 + startM;
      const endTime = endH * 60 + endM;

      if (startTime >= endTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "La hora de inicio debe ser menor que la hora de fin",
        });
      }

      const updated = await prisma.schedule.update({
        where: { id: input.scheduleId },
        data: {
          startHour: input.startHour,
          endHour: input.endHour,
        },
      });

      return updated;
    }),

  // Eliminar un horario individual
  deleteSchedule: protectedProcedure
    .input(z.object({ scheduleId: IdSchema }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      const schedule = await prisma.schedule.findUnique({
        where: { id: input.scheduleId },
        include: {
          field: {
            select: { id: true, ownerId: true },
          },
        },
      });

      if (!schedule) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Horario no encontrado",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);
      if (!userIsAdmin && schedule.field.ownerId !== ctx.user.id) {
        const canDelete = await hasPermissionOrManage(
          ctx.user.id,
          PermissionAction.DELETE,
          PermissionResource.FIELD,
          ctx.user.tenantId
        );
        if (!canDelete) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No tienes permisos para eliminar este horario",
          });
        }
      }

      await prisma.schedule.delete({
        where: { id: input.scheduleId },
      });

      return { success: true };
    }),

  // ----- Público: reservas sin login -----

  // Listar canchas disponibles (público)
  getAllPublic: publicProcedure
    .input(
      z
        .object({
          page: z.number().min(1).optional(),
          limit: z.number().min(1).max(50).optional(),
          search: z.string().optional(),
          sport: SportEnum.optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { page = 1, limit = 12, search, sport } = input ?? {};
      const offset = (page - 1) * limit;
      const where: Prisma.FieldWhereInput = {
        available: true,
        ...(search?.trim() && {
          OR: [
            { name: { contains: search.trim(), mode: "insensitive" } },
            { district: { contains: search.trim(), mode: "insensitive" } },
            { city: { contains: search.trim(), mode: "insensitive" } },
          ],
        }),
        ...(sport && { sport }),
      };
      const [fields, total] = await Promise.all([
        prisma.field.findMany({
          where,
          select: {
            id: true,
            name: true,
            sport: true,
            price: true,
            city: true,
            district: true,
            description: true,
            images: true,
            sportCenter: { select: { name: true } },
          },
          orderBy: { name: "asc" },
          skip: offset,
          take: limit,
        }),
        prisma.field.count({ where }),
      ]);
      return {
        data: fields,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Obtener cancha por ID (público, para página de reserva)
  getByIdPublic: publicProcedure
    .input(z.object({ id: IdSchema }))
    .query(async ({ input }) => {
      const field = await prisma.field.findUnique({
        where: { id: input.id, available: true },
        include: {
          sportCenter: {
            select: {
              id: true,
              name: true,
              address: true,
              district: true,
              _count: { select: { fields: true } },
            },
          },
          schedules: { orderBy: { day: "asc" } },
          fieldFeatures: { include: { feature: true } },
        },
      });
      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }
      return field;
    }),

  // Obtener reservas de una cancha en un rango de fechas (público, para calcular huecos)
  getReservationsForRange: publicProcedure
    .input(
      z.object({
        fieldId: IdSchema,
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      })
    )
    .query(async ({ input }) => {
      const reservations = await prisma.reservation.findMany({
        where: {
          fieldId: input.fieldId,
          status: { in: ["PENDING", "CONFIRMED"] },
          OR: [
            {
              startDate: { lte: new Date(input.endDate) },
              endDate: { gte: new Date(input.startDate) },
            },
          ],
        },
        select: { startDate: true, endDate: true },
      });
      return reservations;
    }),

  // Crear reserva (público: con datos de invitado o userId si está logueado)
  createReservation: publicProcedure
    .input(
      z.object({
        fieldId: IdSchema,
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        amount: z.number().positive(),
        // Invitado (cuando no hay sesión)
        guestName: z.string().min(1).optional(),
        guestEmail: z.string().email().optional(),
        guestPhone: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const field = await prisma.field.findUnique({
        where: { id: input.fieldId, available: true },
      });
      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      const isGuest = !ctx.user?.id;
      if (isGuest) {
        if (
          !input.guestName?.trim() ||
          !input.guestEmail?.trim() ||
          !input.guestPhone?.trim()
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Nombre, email y teléfono son obligatorios para reservar como invitado",
          });
        }
      }

      // Comprobar solapamiento con otras reservas
      const overlapping = await prisma.reservation.count({
        where: {
          fieldId: input.fieldId,
          status: { in: ["PENDING", "CONFIRMED"] },
          OR: [
            {
              startDate: { lt: new Date(input.endDate) },
              endDate: { gt: new Date(input.startDate) },
            },
          ],
        },
      });
      if (overlapping > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El horario seleccionado ya no está disponible",
        });
      }

      const reservation = await prisma.reservation.create({
        data: {
          fieldId: input.fieldId,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          amount: new Prisma.Decimal(input.amount),
          userId: ctx.user?.id ?? null,
          guestName: isGuest ? (input.guestName?.trim() ?? null) : null,
          guestEmail: isGuest ? (input.guestEmail?.trim() ?? null) : null,
          guestPhone: isGuest ? (input.guestPhone?.trim() ?? null) : null,
        },
      });

      return {
        id: reservation.id,
        message: "Reserva registrada correctamente",
      };
    }),
});
