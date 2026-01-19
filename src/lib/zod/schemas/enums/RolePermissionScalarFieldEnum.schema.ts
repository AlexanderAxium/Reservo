import * as z from "zod";

export const RolePermissionScalarFieldEnumSchema = z.enum([
  "id",
  "roleId",
  "permissionId",
  "createdAt",
]);

export type RolePermissionScalarFieldEnum = z.infer<
  typeof RolePermissionScalarFieldEnumSchema
>;
