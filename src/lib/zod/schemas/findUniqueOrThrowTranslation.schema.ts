import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationIncludeObjectSchema } from "./objects/TranslationInclude.schema";
import { TranslationSelectObjectSchema } from "./objects/TranslationSelect.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./objects/TranslationWhereUniqueInput.schema";

export const TranslationFindUniqueOrThrowSchema: z.ZodType<Prisma.TranslationFindUniqueOrThrowArgs> =
  z
    .object({
      select: TranslationSelectObjectSchema.optional(),
      include: TranslationIncludeObjectSchema.optional(),
      where: TranslationWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationFindUniqueOrThrowArgs>;

export const TranslationFindUniqueOrThrowZodSchema = z
  .object({
    select: TranslationSelectObjectSchema.optional(),
    include: TranslationIncludeObjectSchema.optional(),
    where: TranslationWhereUniqueInputObjectSchema,
  })
  .strict();
