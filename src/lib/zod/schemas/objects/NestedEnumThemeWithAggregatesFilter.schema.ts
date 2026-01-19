import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { ThemeSchema } from "../enums/Theme.schema";
import { NestedEnumThemeFilterObjectSchema } from "./NestedEnumThemeFilter.schema";
import { NestedIntFilterObjectSchema } from "./NestedIntFilter.schema";

const nestedenumthemewithaggregatesfilterSchema = z
  .object({
    equals: ThemeSchema.optional(),
    in: ThemeSchema.array().optional(),
    notIn: ThemeSchema.array().optional(),
    not: z
      .union([
        ThemeSchema,
        z.lazy(() => NestedEnumThemeWithAggregatesFilterObjectSchema),
      ])
      .optional(),
    _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
    _min: z.lazy(() => NestedEnumThemeFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumThemeFilterObjectSchema).optional(),
  })
  .strict();
export const NestedEnumThemeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumThemeWithAggregatesFilter> =
  nestedenumthemewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumThemeWithAggregatesFilter>;
export const NestedEnumThemeWithAggregatesFilterObjectZodSchema =
  nestedenumthemewithaggregatesfilterSchema;
