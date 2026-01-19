import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleCreateInputObjectSchema } from "./objects/LocaleCreateInput.schema";
import { LocaleIncludeObjectSchema } from "./objects/LocaleInclude.schema";
import { LocaleSelectObjectSchema } from "./objects/LocaleSelect.schema";
import { LocaleUncheckedCreateInputObjectSchema } from "./objects/LocaleUncheckedCreateInput.schema";
import { LocaleUncheckedUpdateInputObjectSchema } from "./objects/LocaleUncheckedUpdateInput.schema";
import { LocaleUpdateInputObjectSchema } from "./objects/LocaleUpdateInput.schema";
import { LocaleWhereUniqueInputObjectSchema } from "./objects/LocaleWhereUniqueInput.schema";

export const LocaleUpsertOneSchema: z.ZodType<Prisma.LocaleUpsertArgs> = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    where: LocaleWhereUniqueInputObjectSchema,
    create: z.union([
      LocaleCreateInputObjectSchema,
      LocaleUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      LocaleUpdateInputObjectSchema,
      LocaleUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleUpsertArgs>;

export const LocaleUpsertOneZodSchema = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    where: LocaleWhereUniqueInputObjectSchema,
    create: z.union([
      LocaleCreateInputObjectSchema,
      LocaleUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      LocaleUpdateInputObjectSchema,
      LocaleUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();
