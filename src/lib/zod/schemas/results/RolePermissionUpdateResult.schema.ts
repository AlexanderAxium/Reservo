import * as z from "zod";
export const RolePermissionUpdateResultSchema = z.nullable(
  z.object({
    id: z.string(),
    roleId: z.string(),
    permissionId: z.string(),
    createdAt: z.date(),
    permission: z.unknown(),
    role: z.unknown(),
  })
);
