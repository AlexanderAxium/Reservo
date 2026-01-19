import * as z from "zod";

export const RoleScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "displayName",
  "description",
  "isActive",
  "isSystem",
  "createdAt",
  "updatedAt",
  "tenantId",
]);

export type RoleScalarFieldEnum = z.infer<typeof RoleScalarFieldEnumSchema>;
