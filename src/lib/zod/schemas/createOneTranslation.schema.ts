import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationCreateInputObjectSchema } from "./objects/TranslationCreateInput.schema";
import { TranslationIncludeObjectSchema } from "./objects/TranslationInclude.schema";
import { TranslationSelectObjectSchema } from "./objects/TranslationSelect.schema";
import { TranslationUncheckedCreateInputObjectSchema } from "./objects/TranslationUncheckedCreateInput.schema";

export const TranslationCreateOneSchema: z.ZodType<Prisma.TranslationCreateArgs> =
  z
    .object({
      select: TranslationSelectObjectSchema.optional(),
      include: TranslationIncludeObjectSchema.optional(),
      data: z.union([
        TranslationCreateInputObjectSchema,
        TranslationUncheckedCreateInputObjectSchema,
      ]),
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationCreateArgs>;

export const TranslationCreateOneZodSchema = z
  .object({
    select: TranslationSelectObjectSchema.optional(),
    include: TranslationIncludeObjectSchema.optional(),
    data: z.union([
      TranslationCreateInputObjectSchema,
      TranslationUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
