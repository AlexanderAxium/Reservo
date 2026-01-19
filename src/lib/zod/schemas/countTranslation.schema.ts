import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationCountAggregateInputObjectSchema } from "./objects/TranslationCountAggregateInput.schema";
import { TranslationOrderByWithRelationInputObjectSchema } from "./objects/TranslationOrderByWithRelationInput.schema";
import { TranslationWhereInputObjectSchema } from "./objects/TranslationWhereInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./objects/TranslationWhereUniqueInput.schema";

export const TranslationCountSchema: z.ZodType<Prisma.TranslationCountArgs> = z
  .object({
    orderBy: z
      .union([
        TranslationOrderByWithRelationInputObjectSchema,
        TranslationOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: TranslationWhereInputObjectSchema.optional(),
    cursor: TranslationWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    select: z
      .union([z.literal(true), TranslationCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.TranslationCountArgs>;

export const TranslationCountZodSchema = z
  .object({
    orderBy: z
      .union([
        TranslationOrderByWithRelationInputObjectSchema,
        TranslationOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: TranslationWhereInputObjectSchema.optional(),
    cursor: TranslationWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    select: z
      .union([z.literal(true), TranslationCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict();
