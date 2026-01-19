import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationStatusSchema } from "../enums/TranslationStatus.schema";
import { NestedEnumTranslationStatusFilterObjectSchema } from "./NestedEnumTranslationStatusFilter.schema";

const makeSchema = () =>
  z
    .object({
      equals: TranslationStatusSchema.optional(),
      in: TranslationStatusSchema.array().optional(),
      notIn: TranslationStatusSchema.array().optional(),
      not: z
        .union([
          TranslationStatusSchema,
          z.lazy(() => NestedEnumTranslationStatusFilterObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const EnumTranslationStatusFilterObjectSchema: z.ZodType<Prisma.EnumTranslationStatusFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumTranslationStatusFilter>;
export const EnumTranslationStatusFilterObjectZodSchema = makeSchema();
