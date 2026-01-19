import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationStatusSchema } from "../enums/TranslationStatus.schema";
import { LocaleCreateNestedOneWithoutTranslationsInputObjectSchema } from "./LocaleCreateNestedOneWithoutTranslationsInput.schema";
import { TenantCreateNestedOneWithoutTranslationsInputObjectSchema } from "./TenantCreateNestedOneWithoutTranslationsInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      translatableType: z.string(),
      translatableId: z.string(),
      fieldName: z.string(),
      translatedValue: z.string(),
      translationStatus: TranslationStatusSchema.optional(),
      translatorNotes: z.string().optional().nullable(),
      approvedBy: z.string().optional().nullable(),
      approvedAt: z.coerce.date().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      locale: z.lazy(
        () => LocaleCreateNestedOneWithoutTranslationsInputObjectSchema
      ),
      tenant: z
        .lazy(() => TenantCreateNestedOneWithoutTranslationsInputObjectSchema)
        .optional(),
    })
    .strict();
export const TranslationCreateInputObjectSchema: z.ZodType<Prisma.TranslationCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationCreateInput>;
export const TranslationCreateInputObjectZodSchema = makeSchema();
