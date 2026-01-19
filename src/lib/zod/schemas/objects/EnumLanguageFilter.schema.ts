import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LanguageSchema } from "../enums/Language.schema";
import { NestedEnumLanguageFilterObjectSchema } from "./NestedEnumLanguageFilter.schema";

const makeSchema = () =>
  z
    .object({
      equals: LanguageSchema.optional(),
      in: LanguageSchema.array().optional(),
      notIn: LanguageSchema.array().optional(),
      not: z
        .union([
          LanguageSchema,
          z.lazy(() => NestedEnumLanguageFilterObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const EnumLanguageFilterObjectSchema: z.ZodType<Prisma.EnumLanguageFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumLanguageFilter>;
export const EnumLanguageFilterObjectZodSchema = makeSchema();
