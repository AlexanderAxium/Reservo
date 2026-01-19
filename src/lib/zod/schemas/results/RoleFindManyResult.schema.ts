import * as z from "zod";
export const RoleFindManyResultSchema = z.object({
  data: z.array(
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
  ),
  pagination: z.object({
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});
