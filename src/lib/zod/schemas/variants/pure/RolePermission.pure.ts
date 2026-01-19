import * as z from "zod";
// prettier-ignore
export const RolePermissionModelSchema = z
  .object({
    id: z.string(),
    roleId: z.string(),
    permissionId: z.string(),
    createdAt: z.date(),
    permission: z.unknown(),
    role: z.unknown(),
  })
  .strict();

export type RolePermissionPureType = z.infer<typeof RolePermissionModelSchema>;
