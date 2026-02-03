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
import { isAdmin } from "../../services/rbacService";
import { adminProcedure, protectedProcedure, router } from "../trpc";

// Schema para crear una feature
const createFeatureSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Schema para actualizar una feature
const updateFeatureSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const featureRouter = router({
  // Obtener todas las features activas (público para owners)
  getAll: protectedProcedure
    .input(
      paginationInputSchema
        .extend({
          isActive: z.boolean().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const {
        page = 1,
        limit = 100,
        search,
        sortBy,
        sortOrder = "desc",
        isActive,
      } = input || {};
      const offset = calculateOffset(page, limit);

      const searchFilter = createSearchFilter(search, ["name", "description"]);
      const orderBy = createSortOrder(sortBy, sortOrder, {
        name: "name",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      });

      const whereClause = {
        ...searchFilter,
        ...(isActive !== undefined && { isActive }),
      };

      const [features, total] = await Promise.all([
        prisma.feature.findMany({
          where: whereClause,
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.feature.count({
          where: whereClause,
        }),
      ]);

      return createPaginatedResponse(features, total, page, limit);
    }),

  // Obtener todas las features activas (sin paginación, para selects)
  getActive: protectedProcedure.query(async () => {
    const features = await prisma.feature.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return features;
  }),

  // Obtener una feature por ID
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const feature = await prisma.feature.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              fieldFeatures: true,
            },
          },
        },
      });

      if (!feature) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Característica no encontrada",
        });
      }

      return feature;
    }),

  // Crear una nueva feature (solo admin)
  create: adminProcedure
    .input(createFeatureSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      // Verificar que no existe una feature con el mismo nombre
      const existingFeature = await prisma.feature.findUnique({
        where: { name: input.name },
      });

      if (existingFeature) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Ya existe una característica con ese nombre",
        });
      }

      const feature = await prisma.feature.create({
        data: {
          name: input.name,
          description: input.description,
          icon: input.icon,
          isActive: input.isActive,
        },
      });

      return feature;
    }),

  // Actualizar una feature (solo admin)
  update: adminProcedure
    .input(updateFeatureSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      const existingFeature = await prisma.feature.findUnique({
        where: { id: input.id },
      });

      if (!existingFeature) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Característica no encontrada",
        });
      }

      // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
      if (input.name && input.name !== existingFeature.name) {
        const duplicateFeature = await prisma.feature.findUnique({
          where: { name: input.name },
        });

        if (duplicateFeature) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Ya existe una característica con ese nombre",
          });
        }
      }

      const updatedFeature = await prisma.feature.update({
        where: { id: input.id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
          ...(input.icon !== undefined && { icon: input.icon }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
        },
      });

      return updatedFeature;
    }),

  // Eliminar una feature (solo admin)
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      const existingFeature = await prisma.feature.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              fieldFeatures: true,
            },
          },
        },
      });

      if (!existingFeature) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Característica no encontrada",
        });
      }

      // Verificar si está siendo usada en alguna cancha
      if (existingFeature._count.fieldFeatures > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `No se puede eliminar la característica porque está siendo usada en ${existingFeature._count.fieldFeatures} cancha(s)`,
        });
      }

      await prisma.feature.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        message: "Característica eliminada correctamente",
      };
    }),
});
