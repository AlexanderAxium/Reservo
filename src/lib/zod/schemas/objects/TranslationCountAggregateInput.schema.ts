import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.literal(true).optional(),
      translatableType: z.literal(true).optional(),
      translatableId: z.literal(true).optional(),
      localeId: z.literal(true).optional(),
      fieldName: z.literal(true).optional(),
      translatedValue: z.literal(true).optional(),
      translationStatus: z.literal(true).optional(),
      translatorNotes: z.literal(true).optional(),
      approvedBy: z.literal(true).optional(),
      approvedAt: z.literal(true).optional(),
      tenantId: z.literal(true).optional(),
      createdAt: z.literal(true).optional(),
      updatedAt: z.literal(true).optional(),
      _all: z.literal(true).optional(),
    })
    .strict();
export const TranslationCountAggregateInputObjectSchema: z.ZodType<Prisma.TranslationCountAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationCountAggregateInputType>;
export const TranslationCountAggregateInputObjectZodSchema = makeSchema();
