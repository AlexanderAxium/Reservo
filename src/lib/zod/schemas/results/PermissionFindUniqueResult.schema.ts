import * as z from "zod";
export const PermissionFindUniqueResultSchema = z.nullable(
  z.object({
    id: z.string(),
    action: z.unknown(),
    resource: z.unknown(),
    description: z.string().optional(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tenantId: z.string(),
    tenant: z.unknown(),
    rolePermissions: z.array(z.unknown()),
  })
);
