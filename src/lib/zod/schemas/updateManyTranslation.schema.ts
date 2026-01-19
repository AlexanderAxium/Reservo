import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationUpdateManyMutationInputObjectSchema } from "./objects/TranslationUpdateManyMutationInput.schema";
import { TranslationWhereInputObjectSchema } from "./objects/TranslationWhereInput.schema";

export const TranslationUpdateManySchema: z.ZodType<Prisma.TranslationUpdateManyArgs> =
  z
    .object({
      data: TranslationUpdateManyMutationInputObjectSchema,
      where: TranslationWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationUpdateManyArgs>;

export const TranslationUpdateManyZodSchema = z
  .object({
    data: TranslationUpdateManyMutationInputObjectSchema,
    where: TranslationWhereInputObjectSchema.optional(),
  })
  .strict();
