import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationStatusSchema } from "../enums/TranslationStatus.schema";
import { NestedEnumTranslationStatusFilterObjectSchema } from "./NestedEnumTranslationStatusFilter.schema";
import { NestedIntFilterObjectSchema } from "./NestedIntFilter.schema";

const nestedenumtranslationstatuswithaggregatesfilterSchema = z
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
export const NestedEnumTranslationStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTranslationStatusWithAggregatesFilter> =
  nestedenumtranslationstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTranslationStatusWithAggregatesFilter>;
export const NestedEnumTranslationStatusWithAggregatesFilterObjectZodSchema =
  nestedenumtranslationstatuswithaggregatesfilterSchema;
