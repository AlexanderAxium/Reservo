import * as z from "zod";
// prettier-ignore
export const UserRoleModelSchema = z
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

export type UserRolePureType = z.infer<typeof UserRoleModelSchema>;
