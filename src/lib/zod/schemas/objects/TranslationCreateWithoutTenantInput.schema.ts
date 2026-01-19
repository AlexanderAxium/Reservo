import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationStatusSchema } from "../enums/TranslationStatus.schema";
import { LocaleCreateNestedOneWithoutTranslationsInputObjectSchema } from "./LocaleCreateNestedOneWithoutTranslationsInput.schema";

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
      updatedAt: z.coerce.date().optional(),
      locale: z.lazy(
        () => LocaleCreateNestedOneWithoutTranslationsInputObjectSchema
      ),
    })
    .strict();
export const TranslationCreateWithoutTenantInputObjectSchema: z.ZodType<Prisma.TranslationCreateWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationCreateWithoutTenantInput>;
export const TranslationCreateWithoutTenantInputObjectZodSchema = makeSchema();
