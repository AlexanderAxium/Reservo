import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LanguageSchema } from "../enums/Language.schema";
import { NestedEnumLanguageFilterObjectSchema } from "./NestedEnumLanguageFilter.schema";
import { NestedEnumLanguageWithAggregatesFilterObjectSchema } from "./NestedEnumLanguageWithAggregatesFilter.schema";
import { NestedIntFilterObjectSchema } from "./NestedIntFilter.schema";

const makeSchema = () =>
  z
    .object({
      equals: LanguageSchema.optional(),
      in: LanguageSchema.array().optional(),
      notIn: LanguageSchema.array().optional(),
      not: z
        .union([
          LanguageSchema,
          z.lazy(() => NestedEnumLanguageWithAggregatesFilterObjectSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
      _min: z.lazy(() => NestedEnumLanguageFilterObjectSchema).optional(),
      _max: z.lazy(() => NestedEnumLanguageFilterObjectSchema).optional(),
    })
    .strict();
export const EnumLanguageWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumLanguageWithAggregatesFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumLanguageWithAggregatesFilter>;
export const EnumLanguageWithAggregatesFilterObjectZodSchema = makeSchema();
