import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { ThemeSchema } from "../enums/Theme.schema";
import { NestedEnumThemeFilterObjectSchema } from "./NestedEnumThemeFilter.schema";

const makeSchema = () =>
  z
    .object({
      equals: ThemeSchema.optional(),
      in: ThemeSchema.array().optional(),
      notIn: ThemeSchema.array().optional(),
      not: z
        .union([ThemeSchema, z.lazy(() => NestedEnumThemeFilterObjectSchema)])
        .optional(),
    })
    .strict();
export const EnumThemeFilterObjectSchema: z.ZodType<Prisma.EnumThemeFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumThemeFilter>;
export const EnumThemeFilterObjectZodSchema = makeSchema();
