import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationStatusSchema } from "../enums/TranslationStatus.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      translatableType: z.string(),
      translatableId: z.string(),
      localeId: z.string(),
      fieldName: z.string(),
      translatedValue: z.string(),
      translationStatus: TranslationStatusSchema.optional(),
      translatorNotes: z.string().optional().nullable(),
      approvedBy: z.string().optional().nullable(),
      approvedAt: z.coerce.date().optional().nullable(),
      tenantId: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
    })
    .strict();
export const TranslationUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TranslationUncheckedCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationUncheckedCreateInput>;
export const TranslationUncheckedCreateInputObjectZodSchema = makeSchema();
