import * as z from "zod";
// prettier-ignore
export const UserRoleInputSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    roleId: z.string(),
    assignedAt: z.date(),
    assignedBy: z.string().optional().nullable(),
    expiresAt: z.date().optional().nullable(),
    role: z.unknown(),
    user: z.unknown(),
  })
  .strict();

export type UserRoleInputType = z.infer<typeof UserRoleInputSchema>;
