import * as z from "zod";
export const LocaleFindManyResultSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      languageCode: z.string(),
      name: z.string(),
      nativeName: z.string(),
      locale: z.string().optional(),
      direction: z.string(),
      currencySymbol: z.string().optional(),
      isActive: z.boolean(),
      isDefault: z.boolean(),
      flagUrl: z.string().optional(),
      displayOrder: z.number().int(),
      createdAt: z.date(),
      updatedAt: z.date(),
      translations: z.array(z.unknown()),
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
