import * as z from "zod";
export const TranslationUpdateResultSchema = z.nullable(
  z.object({
    id: z.string(),
    translatableType: z.string(),
    translatableId: z.string(),
    localeId: z.string(),
    locale: z.unknown(),
    fieldName: z.string(),
    translatedValue: z.string(),
    translationStatus: z.unknown(),
    translatorNotes: z.string().optional(),
    approvedBy: z.string().optional(),
    approvedAt: z.date().optional(),
    tenantId: z.string().optional(),
    tenant: z.unknown().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
);
