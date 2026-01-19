import * as z from "zod";

export const TranslationScalarFieldEnumSchema = z.enum([
  "id",
  "translatableType",
  "translatableId",
  "localeId",
  "fieldName",
  "translatedValue",
  "translationStatus",
  "translatorNotes",
  "approvedBy",
  "approvedAt",
  "tenantId",
  "createdAt",
  "updatedAt",
]);

export type TranslationScalarFieldEnum = z.infer<
  typeof TranslationScalarFieldEnumSchema
>;
