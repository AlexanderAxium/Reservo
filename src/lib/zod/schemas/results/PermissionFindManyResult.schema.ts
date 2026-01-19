import * as z from "zod";
export const PermissionFindManyResultSchema = z.object({
  data: z.array(
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
