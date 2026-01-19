import * as z from "zod";
// prettier-ignore
export const RolePermissionResultSchema = z
  .object({
    id: z.string(),
    roleId: z.string(),
    permissionId: z.string(),
    createdAt: z.date(),
    permission: z.unknown(),
    role: z.unknown(),
  })
  .strict();

export type RolePermissionResultType = z.infer<
  typeof RolePermissionResultSchema
>;
