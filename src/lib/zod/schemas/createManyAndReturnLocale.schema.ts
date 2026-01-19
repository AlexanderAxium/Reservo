import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleCreateManyInputObjectSchema } from "./objects/LocaleCreateManyInput.schema";
import { LocaleSelectObjectSchema } from "./objects/LocaleSelect.schema";

export const LocaleCreateManyAndReturnSchema: z.ZodType<Prisma.LocaleCreateManyAndReturnArgs> =
  z
    .object({
      select: LocaleSelectObjectSchema.optional(),
      data: z.union([
        LocaleCreateManyInputObjectSchema,
        z.array(LocaleCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.LocaleCreateManyAndReturnArgs>;

export const LocaleCreateManyAndReturnZodSchema = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    data: z.union([
      LocaleCreateManyInputObjectSchema,
      z.array(LocaleCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
