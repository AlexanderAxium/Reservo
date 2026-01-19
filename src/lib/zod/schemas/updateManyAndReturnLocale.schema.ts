import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleSelectObjectSchema } from "./objects/LocaleSelect.schema";
import { LocaleUpdateManyMutationInputObjectSchema } from "./objects/LocaleUpdateManyMutationInput.schema";
import { LocaleWhereInputObjectSchema } from "./objects/LocaleWhereInput.schema";

export const LocaleUpdateManyAndReturnSchema: z.ZodType<Prisma.LocaleUpdateManyAndReturnArgs> =
  z
    .object({
      select: LocaleSelectObjectSchema.optional(),
      data: LocaleUpdateManyMutationInputObjectSchema,
      where: LocaleWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.LocaleUpdateManyAndReturnArgs>;

export const LocaleUpdateManyAndReturnZodSchema = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    data: LocaleUpdateManyMutationInputObjectSchema,
    where: LocaleWhereInputObjectSchema.optional(),
  })
  .strict();
