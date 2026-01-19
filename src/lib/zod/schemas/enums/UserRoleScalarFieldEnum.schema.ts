import * as z from "zod";

export const UserRoleScalarFieldEnumSchema = z.enum([
  "id",
  "userId",
  "roleId",
  "assignedAt",
  "assignedBy",
  "expiresAt",
]);

export type UserRoleScalarFieldEnum = z.infer<
  typeof UserRoleScalarFieldEnumSchema
>;
