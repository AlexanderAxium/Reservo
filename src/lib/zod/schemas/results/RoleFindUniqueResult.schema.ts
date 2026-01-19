import * as z from "zod";
export const RoleFindUniqueResultSchema = z.nullable(
  z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    description: z.string().optional(),
    isActive: z.boolean(),
    isSystem: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tenantId: z.string(),
    rolePermissions: z.array(z.unknown()),
    tenant: z.unknown(),
    userRoles: z.array(z.unknown()),
  })
);
