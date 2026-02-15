import { prisma } from "@/lib/db";
import { seedTenantRolesAndPermissions } from "@/server/seedTenant";
import { z } from "zod";
import { router, superAdminProcedure } from "../trpc";

export const tenantRouter = router({
  list: superAdminProcedure.query(async () => {
    const tenants = await prisma.tenant.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        _count: { select: { users: true } },
      },
      orderBy: { displayName: "asc" },
    });
    return tenants;
  }),

  create: superAdminProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nombre requerido"),
        displayName: z.string().min(1, "Nombre para mostrar requerido"),
        email: z.string().email().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ input }) => {
      const tenant = await prisma.tenant.create({
        data: {
          name: input.name,
          displayName: input.displayName,
          email: input.email || undefined,
        },
      });
      await seedTenantRolesAndPermissions(tenant.id);
      return tenant;
    }),
});
