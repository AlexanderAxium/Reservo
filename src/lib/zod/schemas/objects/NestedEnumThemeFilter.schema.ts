import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { ThemeSchema } from "../enums/Theme.schema";

const nestedenumthemefilterSchema = z
  .object({
    equals: ThemeSchema.optional(),
    in: ThemeSchema.array().optional(),
    notIn: ThemeSchema.array().optional(),
    not: z
      .union([ThemeSchema, z.lazy(() => NestedEnumThemeFilterObjectSchema)])
      .optional(),
  })
  .strict();
export const NestedEnumThemeFilterObjectSchema: z.ZodType<Prisma.NestedEnumThemeFilter> =
  nestedenumthemefilterSchema as unknown as z.ZodType<Prisma.NestedEnumThemeFilter>;
export const NestedEnumThemeFilterObjectZodSchema = nestedenumthemefilterSchema;
