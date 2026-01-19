import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationStatusSchema } from "../enums/TranslationStatus.schema";

const nestedenumtranslationstatusfilterSchema = z
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
export const NestedEnumTranslationStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumTranslationStatusFilter> =
  nestedenumtranslationstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTranslationStatusFilter>;
export const NestedEnumTranslationStatusFilterObjectZodSchema =
  nestedenumtranslationstatusfilterSchema;
