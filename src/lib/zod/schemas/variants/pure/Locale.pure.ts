import * as z from "zod";
// prettier-ignore
export const LocaleModelSchema = z
  .object({
    id: z.string(),
    languageCode: z.string(),
    name: z.string(),
    nativeName: z.string(),
    locale: z.string().nullable(),
    direction: z.string(),
    currencySymbol: z.string().nullable(),
    isActive: z.boolean(),
    isDefault: z.boolean(),
    flagUrl: z.string().nullable(),
    displayOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    translations: z.array(z.unknown()),
  })
  .strict();

export type LocalePureType = z.infer<typeof LocaleModelSchema>;
