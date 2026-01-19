import * as z from "zod";
// prettier-ignore
export const UserRoleResultSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    roleId: z.string(),
    assignedAt: z.date(),
    assignedBy: z.string().nullable(),
    expiresAt: z.date().nullable(),
    role: z.unknown(),
    user: z.unknown(),
  })
  .strict();

export type UserRoleResultType = z.infer<typeof UserRoleResultSchema>;
