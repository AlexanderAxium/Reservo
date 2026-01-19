import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      languageCode: SortOrderSchema.optional(),
      name: SortOrderSchema.optional(),
      nativeName: SortOrderSchema.optional(),
      locale: SortOrderSchema.optional(),
      direction: SortOrderSchema.optional(),
      currencySymbol: SortOrderSchema.optional(),
      isActive: SortOrderSchema.optional(),
      isDefault: SortOrderSchema.optional(),
      flagUrl: SortOrderSchema.optional(),
      displayOrder: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
    })
    .strict();
export const LocaleCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.LocaleCountOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleCountOrderByAggregateInput>;
export const LocaleCountOrderByAggregateInputObjectZodSchema = makeSchema();
