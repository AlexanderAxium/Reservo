import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";
import { TranslationOrderByRelationAggregateInputObjectSchema } from "./TranslationOrderByRelationAggregateInput.schema";

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
      translations: z
        .lazy(() => TranslationOrderByRelationAggregateInputObjectSchema)
        .optional(),
    })
    .strict();
export const LocaleOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.LocaleOrderByWithRelationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleOrderByWithRelationInput>;
export const LocaleOrderByWithRelationInputObjectZodSchema = makeSchema();
