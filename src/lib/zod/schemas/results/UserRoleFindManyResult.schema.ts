import * as z from "zod";
export const UserRoleFindManyResultSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      roleId: z.string(),
      assignedAt: z.date(),
      assignedBy: z.string().optional(),
      expiresAt: z.date().optional(),
      role: z.unknown(),
      user: z.unknown(),
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
