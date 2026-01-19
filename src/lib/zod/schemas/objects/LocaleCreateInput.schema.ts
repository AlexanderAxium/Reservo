import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateNestedManyWithoutLocaleInputObjectSchema } from "./TranslationCreateNestedManyWithoutLocaleInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      languageCode: z.string(),
      name: z.string(),
      nativeName: z.string(),
      locale: z.string().optional().nullable(),
      direction: z.string().optional(),
      currencySymbol: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
      isDefault: z.boolean().optional(),
      flagUrl: z.string().optional().nullable(),
      displayOrder: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      translations: z.lazy(
        () => TranslationCreateNestedManyWithoutLocaleInputObjectSchema
      ),
    })
    .strict();
export const LocaleCreateInputObjectSchema: z.ZodType<Prisma.LocaleCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleCreateInput>;
export const LocaleCreateInputObjectZodSchema = makeSchema();
