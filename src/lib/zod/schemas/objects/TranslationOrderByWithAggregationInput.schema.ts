import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";
import { TranslationCountOrderByAggregateInputObjectSchema } from "./TranslationCountOrderByAggregateInput.schema";
import { TranslationMaxOrderByAggregateInputObjectSchema } from "./TranslationMaxOrderByAggregateInput.schema";
import { TranslationMinOrderByAggregateInputObjectSchema } from "./TranslationMinOrderByAggregateInput.schema";

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
      translatorNotes: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      approvedBy: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      approvedAt: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      tenantId: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      _count: z
        .lazy(() => TranslationCountOrderByAggregateInputObjectSchema)
        .optional(),
      _max: z
        .lazy(() => TranslationMaxOrderByAggregateInputObjectSchema)
        .optional(),
      _min: z
        .lazy(() => TranslationMinOrderByAggregateInputObjectSchema)
        .optional(),
    })
    .strict();
export const TranslationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TranslationOrderByWithAggregationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationOrderByWithAggregationInput>;
export const TranslationOrderByWithAggregationInputObjectZodSchema =
  makeSchema();
