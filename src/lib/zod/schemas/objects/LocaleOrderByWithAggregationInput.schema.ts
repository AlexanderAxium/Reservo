import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { LocaleAvgOrderByAggregateInputObjectSchema } from "./LocaleAvgOrderByAggregateInput.schema";
import { LocaleCountOrderByAggregateInputObjectSchema } from "./LocaleCountOrderByAggregateInput.schema";
import { LocaleMaxOrderByAggregateInputObjectSchema } from "./LocaleMaxOrderByAggregateInput.schema";
import { LocaleMinOrderByAggregateInputObjectSchema } from "./LocaleMinOrderByAggregateInput.schema";
import { LocaleSumOrderByAggregateInputObjectSchema } from "./LocaleSumOrderByAggregateInput.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      languageCode: SortOrderSchema.optional(),
      name: SortOrderSchema.optional(),
      nativeName: SortOrderSchema.optional(),
      locale: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      direction: SortOrderSchema.optional(),
      currencySymbol: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      isActive: SortOrderSchema.optional(),
      isDefault: SortOrderSchema.optional(),
      flagUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      displayOrder: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      _count: z
        .lazy(() => LocaleCountOrderByAggregateInputObjectSchema)
        .optional(),
      _avg: z.lazy(() => LocaleAvgOrderByAggregateInputObjectSchema).optional(),
      _max: z.lazy(() => LocaleMaxOrderByAggregateInputObjectSchema).optional(),
      _min: z.lazy(() => LocaleMinOrderByAggregateInputObjectSchema).optional(),
      _sum: z.lazy(() => LocaleSumOrderByAggregateInputObjectSchema).optional(),
    })
    .strict();
export const LocaleOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.LocaleOrderByWithAggregationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleOrderByWithAggregationInput>;
export const LocaleOrderByWithAggregationInputObjectZodSchema = makeSchema();
