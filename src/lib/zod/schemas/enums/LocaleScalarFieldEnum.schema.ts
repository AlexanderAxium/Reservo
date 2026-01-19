import * as z from "zod";

export const LocaleScalarFieldEnumSchema = z.enum([
  "id",
  "languageCode",
  "name",
  "nativeName",
  "locale",
  "direction",
  "currencySymbol",
  "isActive",
  "isDefault",
  "flagUrl",
  "displayOrder",
  "createdAt",
  "updatedAt",
]);

export type LocaleScalarFieldEnum = z.infer<typeof LocaleScalarFieldEnumSchema>;
