import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationFindManySchema } from "../findManyTranslation.schema";
import { LocaleCountOutputTypeArgsObjectSchema } from "./LocaleCountOutputTypeArgs.schema";

const makeSchema = () =>
  z
    .object({
      id: z.boolean().optional(),
      languageCode: z.boolean().optional(),
      name: z.boolean().optional(),
      nativeName: z.boolean().optional(),
      locale: z.boolean().optional(),
      direction: z.boolean().optional(),
      currencySymbol: z.boolean().optional(),
      isActive: z.boolean().optional(),
      isDefault: z.boolean().optional(),
      flagUrl: z.boolean().optional(),
      displayOrder: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      updatedAt: z.boolean().optional(),
      translations: z
        .union([z.boolean(), z.lazy(() => TranslationFindManySchema)])
        .optional(),
      _count: z
        .union([
          z.boolean(),
          z.lazy(() => LocaleCountOutputTypeArgsObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const LocaleSelectObjectSchema: z.ZodType<Prisma.LocaleSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleSelect>;
export const LocaleSelectObjectZodSchema = makeSchema();
