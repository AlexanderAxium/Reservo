import * as z from "zod";

export const UserScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "email",
  "emailVerified",
  "image",
  "createdAt",
  "updatedAt",
  "phone",
  "language",
  "theme",
  "tenantId",
]);

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;
