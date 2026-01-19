import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleIncludeObjectSchema } from "./objects/LocaleInclude.schema";
import { LocaleSelectObjectSchema } from "./objects/LocaleSelect.schema";
import { LocaleWhereUniqueInputObjectSchema } from "./objects/LocaleWhereUniqueInput.schema";

export const LocaleFindUniqueOrThrowSchema: z.ZodType<Prisma.LocaleFindUniqueOrThrowArgs> =
  z
    .object({
      select: LocaleSelectObjectSchema.optional(),
      include: LocaleIncludeObjectSchema.optional(),
      where: LocaleWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.LocaleFindUniqueOrThrowArgs>;

export const LocaleFindUniqueOrThrowZodSchema = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    where: LocaleWhereUniqueInputObjectSchema,
  })
  .strict();
