import * as z from "zod";

export const PermissionScalarFieldEnumSchema = z.enum([
  "id",
  "action",
  "resource",
  "description",
  "isActive",
  "createdAt",
  "updatedAt",
  "tenantId",
]);

export type PermissionScalarFieldEnum = z.infer<
  typeof PermissionScalarFieldEnumSchema
>;
