import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationWhereInputObjectSchema } from "./objects/TranslationWhereInput.schema";

export const TranslationDeleteManySchema: z.ZodType<Prisma.TranslationDeleteManyArgs> =
  z
    .object({ where: TranslationWhereInputObjectSchema.optional() })
    .strict() as unknown as z.ZodType<Prisma.TranslationDeleteManyArgs>;

export const TranslationDeleteManyZodSchema = z
  .object({ where: TranslationWhereInputObjectSchema.optional() })
  .strict();
