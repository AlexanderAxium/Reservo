import * as z from "zod";
export const LocaleGroupByResultSchema = z.array(
  z.object({
    id: z.string(),
    languageCode: z.string(),
    name: z.string(),
    nativeName: z.string(),
    locale: z.string(),
    direction: z.string(),
    currencySymbol: z.string(),
    isActive: z.boolean(),
    isDefault: z.boolean(),
    flagUrl: z.string(),
    displayOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    _count: z
      .object({
        id: z.number(),
        languageCode: z.number(),
        name: z.number(),
        nativeName: z.number(),
        locale: z.number(),
        direction: z.number(),
        currencySymbol: z.number(),
        isActive: z.number(),
        isDefault: z.number(),
        flagUrl: z.number(),
        displayOrder: z.number(),
        createdAt: z.number(),
        updatedAt: z.number(),
        translations: z.number(),
      })
      .optional(),
    _sum: z
      .object({
        displayOrder: z.number().nullable(),
      })
      .nullable()
      .optional(),
    _avg: z
      .object({
        displayOrder: z.number().nullable(),
      })
      .nullable()
      .optional(),
    _min: z
      .object({
        id: z.string().nullable(),
        languageCode: z.string().nullable(),
        name: z.string().nullable(),
        nativeName: z.string().nullable(),
        locale: z.string().nullable(),
        direction: z.string().nullable(),
        currencySymbol: z.string().nullable(),
        flagUrl: z.string().nullable(),
        displayOrder: z.number().int().nullable(),
        createdAt: z.date().nullable(),
        updatedAt: z.date().nullable(),
      })
      .nullable()
      .optional(),
    _max: z
      .object({
        id: z.string().nullable(),
        languageCode: z.string().nullable(),
        name: z.string().nullable(),
        nativeName: z.string().nullable(),
        locale: z.string().nullable(),
        direction: z.string().nullable(),
        currencySymbol: z.string().nullable(),
        flagUrl: z.string().nullable(),
        displayOrder: z.number().int().nullable(),
        createdAt: z.date().nullable(),
        updatedAt: z.date().nullable(),
      })
      .nullable()
      .optional(),
  })
);
