import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationIncludeObjectSchema } from "./objects/TranslationInclude.schema";
import { TranslationSelectObjectSchema } from "./objects/TranslationSelect.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./objects/TranslationWhereUniqueInput.schema";

export const TranslationDeleteOneSchema: z.ZodType<Prisma.TranslationDeleteArgs> =
  z
    .object({
      select: TranslationSelectObjectSchema.optional(),
      include: TranslationIncludeObjectSchema.optional(),
      where: TranslationWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationDeleteArgs>;

export const TranslationDeleteOneZodSchema = z
  .object({
    select: TranslationSelectObjectSchema.optional(),
    include: TranslationIncludeObjectSchema.optional(),
    where: TranslationWhereUniqueInputObjectSchema,
  })
  .strict();
