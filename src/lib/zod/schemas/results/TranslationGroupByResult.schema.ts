import * as z from "zod";
export const TranslationGroupByResultSchema = z.array(
  z.object({
    id: z.string(),
    translatableType: z.string(),
    translatableId: z.string(),
    localeId: z.string(),
    fieldName: z.string(),
    translatedValue: z.string(),
    translatorNotes: z.string(),
    approvedBy: z.string(),
    approvedAt: z.date(),
    tenantId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    _count: z
      .object({
        id: z.number(),
        translatableType: z.number(),
        translatableId: z.number(),
        localeId: z.number(),
        locale: z.number(),
        fieldName: z.number(),
        translatedValue: z.number(),
        translationStatus: z.number(),
        translatorNotes: z.number(),
        approvedBy: z.number(),
        approvedAt: z.number(),
        tenantId: z.number(),
        tenant: z.number(),
        createdAt: z.number(),
        updatedAt: z.number(),
      })
      .optional(),
    _min: z
      .object({
        id: z.string().nullable(),
        translatableType: z.string().nullable(),
        translatableId: z.string().nullable(),
        localeId: z.string().nullable(),
        fieldName: z.string().nullable(),
        translatedValue: z.string().nullable(),
        translatorNotes: z.string().nullable(),
        approvedBy: z.string().nullable(),
        approvedAt: z.date().nullable(),
        tenantId: z.string().nullable(),
        createdAt: z.date().nullable(),
        updatedAt: z.date().nullable(),
      })
      .nullable()
      .optional(),
    _max: z
      .object({
        id: z.string().nullable(),
        translatableType: z.string().nullable(),
        translatableId: z.string().nullable(),
        localeId: z.string().nullable(),
        fieldName: z.string().nullable(),
        translatedValue: z.string().nullable(),
        translatorNotes: z.string().nullable(),
        approvedBy: z.string().nullable(),
        approvedAt: z.date().nullable(),
        tenantId: z.string().nullable(),
        createdAt: z.date().nullable(),
        updatedAt: z.date().nullable(),
      })
      .nullable()
      .optional(),
  })
);
