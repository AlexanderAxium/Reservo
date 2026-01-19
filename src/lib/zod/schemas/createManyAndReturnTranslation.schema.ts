import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationCreateManyInputObjectSchema } from "./objects/TranslationCreateManyInput.schema";
import { TranslationSelectObjectSchema } from "./objects/TranslationSelect.schema";

export const TranslationCreateManyAndReturnSchema: z.ZodType<Prisma.TranslationCreateManyAndReturnArgs> =
  z
    .object({
      select: TranslationSelectObjectSchema.optional(),
      data: z.union([
        TranslationCreateManyInputObjectSchema,
        z.array(TranslationCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationCreateManyAndReturnArgs>;

export const TranslationCreateManyAndReturnZodSchema = z
  .object({
    select: TranslationSelectObjectSchema.optional(),
    data: z.union([
      TranslationCreateManyInputObjectSchema,
      z.array(TranslationCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
