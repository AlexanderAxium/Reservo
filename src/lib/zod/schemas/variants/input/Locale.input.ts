import * as z from "zod";
// prettier-ignore
export const LocaleInputSchema = z
  .object({
    id: z.string(),
    languageCode: z.string(),
    name: z.string(),
    nativeName: z.string(),
    locale: z.string().optional().nullable(),
    direction: z.string(),
    currencySymbol: z.string().optional().nullable(),
    isActive: z.boolean(),
    isDefault: z.boolean(),
    flagUrl: z.string().optional().nullable(),
    displayOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    translations: z.array(z.unknown()),
  })
  .strict();

export type LocaleInputType = z.infer<typeof LocaleInputSchema>;
