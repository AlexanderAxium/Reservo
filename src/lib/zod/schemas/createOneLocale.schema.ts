import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleCreateInputObjectSchema } from "./objects/LocaleCreateInput.schema";
import { LocaleIncludeObjectSchema } from "./objects/LocaleInclude.schema";
import { LocaleSelectObjectSchema } from "./objects/LocaleSelect.schema";
import { LocaleUncheckedCreateInputObjectSchema } from "./objects/LocaleUncheckedCreateInput.schema";

export const LocaleCreateOneSchema: z.ZodType<Prisma.LocaleCreateArgs> = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    data: z.union([
      LocaleCreateInputObjectSchema,
      LocaleUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleCreateArgs>;

export const LocaleCreateOneZodSchema = z
  .object({
    select: LocaleSelectObjectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    data: z.union([
      LocaleCreateInputObjectSchema,
      LocaleUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
