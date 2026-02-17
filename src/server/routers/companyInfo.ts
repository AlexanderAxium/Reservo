import { TenantUncheckedUpdateInputObjectZodSchema } from "@/lib/zod/schemas/objects/TenantUncheckedUpdateInput.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/db";
import { hasPermissionOrManage } from "../../services/rbacService";
import { PermissionAction, PermissionResource } from "../../types/rbac";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { requireTenantId } from "../utils/tenant";

export const companyInfoRouter = router({
  // Get company information (public - returns first active tenant or default)
  get: publicProcedure.query(async ({ ctx }) => {
    // If user is authenticated, try to get their tenant
    if (ctx.user?.tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: {
          id: ctx.user.tenantId,
          isActive: true,
        },
      });

      if (tenant) {
        return tenant;
      }
    }

    // Otherwise, get the first active tenant (or create a default one)
    const firstTenant = await prisma.tenant.findFirst({
      where: {
        isActive: true,
      },
    });

    if (firstTenant) {
      return firstTenant;
    }

    // Return null if no tenant exists (Footer will use default values)
    return null;
  }),

  // Update company information (admin only)
  update: protectedProcedure
    .input(
      TenantUncheckedUpdateInputObjectZodSchema.pick({
        name: true,
        displayName: true,
        description: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        website: true,
        facebookUrl: true,
        twitterUrl: true,
        instagramUrl: true,
        linkedinUrl: true,
        youtubeUrl: true,
        foundedYear: true,
        logoUrl: true,
        faviconUrl: true,
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
        termsUrl: true,
        privacyUrl: true,
        cookiesUrl: true,
        complaintsUrl: true,
      })
        .partial()
        .extend({
          email: z.string().email().optional(),
          website: z.string().url().optional(),
          facebookUrl: z.string().url().optional().nullable(),
          twitterUrl: z.string().url().optional().nullable(),
          instagramUrl: z.string().url().optional().nullable(),
          linkedinUrl: z.string().url().optional().nullable(),
          youtubeUrl: z.string().url().optional().nullable(),
          logoUrl: z
            .string()
            .optional()
            .nullable()
            .refine(
              (val) => {
                if (!val || val.trim() === "") return true;
                if (z.string().url().safeParse(val).success) return true;
                if (val.startsWith("/")) return true;
                return false;
              },
              {
                message:
                  "URL del logo debe ser una URL válida (http://...) o una ruta relativa (/images/...)",
              }
            ),
          faviconUrl: z
            .string()
            .optional()
            .nullable()
            .refine(
              (val) => {
                if (!val || val.trim() === "") return true;
                if (z.string().url().safeParse(val).success) return true;
                if (val.startsWith("/")) return true;
                return false;
              },
              {
                message:
                  "URL del favicon debe ser una URL válida (http://...) o una ruta relativa (/favicon.ico)",
              }
            ),
          foundedYear: z
            .number()
            .int()
            .min(1800)
            .max(new Date().getFullYear())
            .optional(),
        })
    )
    .mutation(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user?.tenantId);

      // Verificar si el usuario tiene permiso para actualizar información de admin
      const canUpdate = await hasPermissionOrManage(
        ctx.user.id,
        PermissionAction.UPDATE,
        PermissionResource.ADMIN,
        tenantId
      );

      if (!canUpdate) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "No tienes permisos para actualizar la información de la empresa",
        });
      }

      // Update tenant information
      const updatedTenant = await prisma.tenant.update({
        where: { id: tenantId },
        data: {
          ...input,
          updatedAt: new Date(),
        },
      });
      return updatedTenant;
    }),

  // Get company info for admin dashboard
  getForAdmin: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = requireTenantId(ctx.user?.tenantId);

    // Verificar si el usuario tiene permiso para leer información de admin
    const canRead = await hasPermissionOrManage(
      ctx.user.id,
      PermissionAction.READ,
      PermissionResource.ADMIN,
      tenantId
    );

    if (!canRead) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No tienes permisos para ver la información de administración",
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
        isActive: true,
      },
    });

    return tenant;
  }),
});
