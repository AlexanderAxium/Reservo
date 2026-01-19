import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationStatusSchema } from "../enums/TranslationStatus.schema";
import { NestedEnumTranslationStatusFilterObjectSchema } from "./NestedEnumTranslationStatusFilter.schema";
import { NestedEnumTranslationStatusWithAggregatesFilterObjectSchema } from "./NestedEnumTranslationStatusWithAggregatesFilter.schema";
import { NestedIntFilterObjectSchema } from "./NestedIntFilter.schema";

const makeSchema = () =>
  z
    .object({
      equals: TranslationStatusSchema.optional(),
      in: TranslationStatusSchema.array().optional(),
      notIn: TranslationStatusSchema.array().optional(),
      not: z
        .union([
          TranslationStatusSchema,
          z.lazy(
            () => NestedEnumTranslationStatusWithAggregatesFilterObjectSchema
          ),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
      _min: z
        .lazy(() => NestedEnumTranslationStatusFilterObjectSchema)
        .optional(),
      _max: z
        .lazy(() => NestedEnumTranslationStatusFilterObjectSchema)
        .optional(),
    })
    .strict();
export const EnumTranslationStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTranslationStatusWithAggregatesFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumTranslationStatusWithAggregatesFilter>;
export const EnumTranslationStatusWithAggregatesFilterObjectZodSchema =
  makeSchema();
