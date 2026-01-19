import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleWhereInputObjectSchema } from "./objects/LocaleWhereInput.schema";

export const LocaleDeleteManySchema: z.ZodType<Prisma.LocaleDeleteManyArgs> = z
  .object({ where: LocaleWhereInputObjectSchema.optional() })
  .strict() as unknown as z.ZodType<Prisma.LocaleDeleteManyArgs>;

export const LocaleDeleteManyZodSchema = z
  .object({ where: LocaleWhereInputObjectSchema.optional() })
  .strict();
