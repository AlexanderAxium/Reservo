import * as z from "zod";
import { TranslationStatusSchema } from "../../enums/TranslationStatus.schema";
// prettier-ignore
export const TranslationInputSchema = z
  .object({
    id: z.string(),
    translatableType: z.string(),
    translatableId: z.string(),
    localeId: z.string(),
    locale: z.unknown(),
    fieldName: z.string(),
    translatedValue: z.string(),
    translationStatus: TranslationStatusSchema,
    translatorNotes: z.string().optional().nullable(),
    approvedBy: z.string().optional().nullable(),
    approvedAt: z.date().optional().nullable(),
    tenantId: z.string().optional().nullable(),
    tenant: z.unknown().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type TranslationInputType = z.infer<typeof TranslationInputSchema>;
