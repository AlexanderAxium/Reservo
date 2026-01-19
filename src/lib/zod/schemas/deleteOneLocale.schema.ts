import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleIncludeObjectSchema } from "./objects/LocaleInclude.schema";
import { LocaleSelectObjectSchema } from "./objects/LocaleSelect.schema";
import { LocaleWhereUniqueInputObjectSchema } from "./objects/LocaleWhereUniqueInput.schema";

export const LocaleDeleteOneSchema: z.ZodType<Prisma.LocaleDeleteArgs> = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    where: LocaleWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleDeleteArgs>;

export const LocaleDeleteOneZodSchema = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    where: LocaleWhereUniqueInputObjectSchema,
  })
  .strict();
