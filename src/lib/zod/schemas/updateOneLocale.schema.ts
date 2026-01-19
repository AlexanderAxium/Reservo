import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleIncludeObjectSchema } from "./objects/LocaleInclude.schema";
import { LocaleSelectObjectSchema } from "./objects/LocaleSelect.schema";
import { LocaleUncheckedUpdateInputObjectSchema } from "./objects/LocaleUncheckedUpdateInput.schema";
import { LocaleUpdateInputObjectSchema } from "./objects/LocaleUpdateInput.schema";
import { LocaleWhereUniqueInputObjectSchema } from "./objects/LocaleWhereUniqueInput.schema";

export const LocaleUpdateOneSchema: z.ZodType<Prisma.LocaleUpdateArgs> = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    data: z.union([
      LocaleUpdateInputObjectSchema,
      LocaleUncheckedUpdateInputObjectSchema,
    ]),
    where: LocaleWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleUpdateArgs>;

export const LocaleUpdateOneZodSchema = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    data: z.union([
      LocaleUpdateInputObjectSchema,
      LocaleUncheckedUpdateInputObjectSchema,
    ]),
    where: LocaleWhereUniqueInputObjectSchema,
  })
  .strict();
