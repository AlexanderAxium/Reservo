import * as z from "zod";
// prettier-ignore
export const RolePermissionInputSchema = z
  .object({
    id: z.string(),
    roleId: z.string(),
    permissionId: z.string(),
    createdAt: z.date(),
    permission: z.unknown(),
    role: z.unknown(),
  })
  .strict();

export type RolePermissionInputType = z.infer<typeof RolePermissionInputSchema>;
