import * as z from "zod";
export const TranslationFindManyResultSchema = z.object({
  data: z.array(
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
  ),
  pagination: z.object({
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});
