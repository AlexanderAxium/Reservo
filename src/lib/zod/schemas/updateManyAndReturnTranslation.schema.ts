import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationSelectObjectSchema } from "./objects/TranslationSelect.schema";
import { TranslationUpdateManyMutationInputObjectSchema } from "./objects/TranslationUpdateManyMutationInput.schema";
import { TranslationWhereInputObjectSchema } from "./objects/TranslationWhereInput.schema";

export const TranslationUpdateManyAndReturnSchema: z.ZodType<Prisma.TranslationUpdateManyAndReturnArgs> =
  z
    .object({
      select: TranslationSelectObjectSchema.optional(),
      data: TranslationUpdateManyMutationInputObjectSchema,
      where: TranslationWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationUpdateManyAndReturnArgs>;

export const TranslationUpdateManyAndReturnZodSchema = z
  .object({
    select: TranslationSelectObjectSchema.optional(),
    data: TranslationUpdateManyMutationInputObjectSchema,
    where: TranslationWhereInputObjectSchema.optional(),
  })
  .strict();
