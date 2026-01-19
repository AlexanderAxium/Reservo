import * as z from "zod";
export const RolePermissionFindManyResultSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      roleId: z.string(),
      permissionId: z.string(),
      createdAt: z.date(),
      permission: z.unknown(),
      role: z.unknown(),
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
