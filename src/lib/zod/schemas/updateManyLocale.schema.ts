import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleUpdateManyMutationInputObjectSchema } from "./objects/LocaleUpdateManyMutationInput.schema";
import { LocaleWhereInputObjectSchema } from "./objects/LocaleWhereInput.schema";

export const LocaleUpdateManySchema: z.ZodType<Prisma.LocaleUpdateManyArgs> = z
  .object({
    data: LocaleUpdateManyMutationInputObjectSchema,
    where: LocaleWhereInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleUpdateManyArgs>;

export const LocaleUpdateManyZodSchema = z
  .object({
    data: LocaleUpdateManyMutationInputObjectSchema,
    where: LocaleWhereInputObjectSchema.optional(),
  })
  .strict();
