import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationCreateInputObjectSchema } from "./objects/TranslationCreateInput.schema";
import { TranslationIncludeObjectSchema } from "./objects/TranslationInclude.schema";
import { TranslationSelectObjectSchema } from "./objects/TranslationSelect.schema";
import { TranslationUncheckedCreateInputObjectSchema } from "./objects/TranslationUncheckedCreateInput.schema";
import { TranslationUncheckedUpdateInputObjectSchema } from "./objects/TranslationUncheckedUpdateInput.schema";
import { TranslationUpdateInputObjectSchema } from "./objects/TranslationUpdateInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./objects/TranslationWhereUniqueInput.schema";

export const TranslationUpsertOneSchema: z.ZodType<Prisma.TranslationUpsertArgs> =
  z
    .object({
      select: TranslationSelectObjectSchema.optional(),
      include: TranslationIncludeObjectSchema.optional(),
      where: TranslationWhereUniqueInputObjectSchema,
      create: z.union([
        TranslationCreateInputObjectSchema,
        TranslationUncheckedCreateInputObjectSchema,
      ]),
      update: z.union([
        TranslationUpdateInputObjectSchema,
        TranslationUncheckedUpdateInputObjectSchema,
      ]),
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationUpsertArgs>;

export const TranslationUpsertOneZodSchema = z
  .object({
    select: TranslationSelectObjectSchema.optional(),
    include: TranslationIncludeObjectSchema.optional(),
    where: TranslationWhereUniqueInputObjectSchema,
    create: z.union([
      TranslationCreateInputObjectSchema,
      TranslationUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      TranslationUpdateInputObjectSchema,
      TranslationUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();
