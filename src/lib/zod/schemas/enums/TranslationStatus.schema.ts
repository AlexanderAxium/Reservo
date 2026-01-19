import * as z from "zod";

export const TranslationStatusSchema = z.enum([
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "PUBLISHED",
]);

export type TranslationStatus = z.infer<typeof TranslationStatusSchema>;
