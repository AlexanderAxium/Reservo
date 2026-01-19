import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LanguageSchema } from "../enums/Language.schema";

const nestedenumlanguagefilterSchema = z
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
export const NestedEnumLanguageFilterObjectSchema: z.ZodType<Prisma.NestedEnumLanguageFilter> =
  nestedenumlanguagefilterSchema as unknown as z.ZodType<Prisma.NestedEnumLanguageFilter>;
export const NestedEnumLanguageFilterObjectZodSchema =
  nestedenumlanguagefilterSchema;
