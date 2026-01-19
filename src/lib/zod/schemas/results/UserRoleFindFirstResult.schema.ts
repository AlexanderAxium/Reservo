import * as z from "zod";
export const UserRoleFindFirstResultSchema = z.nullable(
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
);
