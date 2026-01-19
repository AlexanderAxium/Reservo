import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationIncludeObjectSchema } from "./objects/TranslationInclude.schema";
import { TranslationSelectObjectSchema } from "./objects/TranslationSelect.schema";
import { TranslationUncheckedUpdateInputObjectSchema } from "./objects/TranslationUncheckedUpdateInput.schema";
import { TranslationUpdateInputObjectSchema } from "./objects/TranslationUpdateInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./objects/TranslationWhereUniqueInput.schema";

export const TranslationUpdateOneSchema: z.ZodType<Prisma.TranslationUpdateArgs> =
  z
    .object({
      select: TranslationSelectObjectSchema.optional(),
      include: TranslationIncludeObjectSchema.optional(),
      data: z.union([
        TranslationUpdateInputObjectSchema,
        TranslationUncheckedUpdateInputObjectSchema,
      ]),
      where: TranslationWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationUpdateArgs>;

export const TranslationUpdateOneZodSchema = z
  .object({
    select: TranslationSelectObjectSchema.optional(),
    include: TranslationIncludeObjectSchema.optional(),
    data: z.union([
      TranslationUpdateInputObjectSchema,
      TranslationUncheckedUpdateInputObjectSchema,
    ]),
    where: TranslationWhereUniqueInputObjectSchema,
  })
  .strict();
