import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      translatableType: SortOrderSchema.optional(),
      translatableId: SortOrderSchema.optional(),
      localeId: SortOrderSchema.optional(),
      fieldName: SortOrderSchema.optional(),
      translatedValue: SortOrderSchema.optional(),
      translationStatus: SortOrderSchema.optional(),
      translatorNotes: SortOrderSchema.optional(),
      approvedBy: SortOrderSchema.optional(),
      approvedAt: SortOrderSchema.optional(),
      tenantId: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
    })
    .strict();
export const TranslationMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TranslationMinOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationMinOrderByAggregateInput>;
export const TranslationMinOrderByAggregateInputObjectZodSchema = makeSchema();
