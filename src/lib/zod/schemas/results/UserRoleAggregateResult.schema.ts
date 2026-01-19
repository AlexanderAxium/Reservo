import * as z from "zod";
export const UserRoleAggregateResultSchema = z.object({
  _count: z
    .object({
      id: z.number(),
      userId: z.number(),
      roleId: z.number(),
      assignedAt: z.number(),
      assignedBy: z.number(),
      expiresAt: z.number(),
      role: z.number(),
      user: z.number(),
    })
    .optional(),
  _min: z
    .object({
      id: z.string().nullable(),
      userId: z.string().nullable(),
      roleId: z.string().nullable(),
      assignedAt: z.date().nullable(),
      assignedBy: z.string().nullable(),
      expiresAt: z.date().nullable(),
    })
    .nullable()
    .optional(),
  _max: z
    .object({
      id: z.string().nullable(),
      userId: z.string().nullable(),
      roleId: z.string().nullable(),
      assignedAt: z.date().nullable(),
      assignedBy: z.string().nullable(),
      expiresAt: z.date().nullable(),
    })
    .nullable()
    .optional(),
});
