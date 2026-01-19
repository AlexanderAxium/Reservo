import * as z from "zod";
export const LocaleFindFirstResultSchema = z.nullable(
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
);
