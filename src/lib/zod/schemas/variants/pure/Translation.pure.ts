import * as z from "zod";
import { TranslationStatusSchema } from "../../enums/TranslationStatus.schema";
// prettier-ignore
export const TranslationModelSchema = z
  .object({
    id: z.string(),
    translatableType: z.string(),
    translatableId: z.string(),
    localeId: z.string(),
    locale: z.unknown(),
    fieldName: z.string(),
    translatedValue: z.string(),
    translationStatus: TranslationStatusSchema,
    translatorNotes: z.string().nullable(),
    approvedBy: z.string().nullable(),
    approvedAt: z.date().nullable(),
    tenantId: z.string().nullable(),
    tenant: z.unknown().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type TranslationPureType = z.infer<typeof TranslationModelSchema>;
