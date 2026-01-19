import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationCountAggregateInputObjectSchema } from "./objects/TranslationCountAggregateInput.schema";
import { TranslationMaxAggregateInputObjectSchema } from "./objects/TranslationMaxAggregateInput.schema";
import { TranslationMinAggregateInputObjectSchema } from "./objects/TranslationMinAggregateInput.schema";
import { TranslationOrderByWithRelationInputObjectSchema } from "./objects/TranslationOrderByWithRelationInput.schema";
import { TranslationWhereInputObjectSchema } from "./objects/TranslationWhereInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./objects/TranslationWhereUniqueInput.schema";

export const TranslationAggregateSchema: z.ZodType<Prisma.TranslationAggregateArgs> =
  z
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
      _count: z
        .union([z.literal(true), TranslationCountAggregateInputObjectSchema])
        .optional(),
      _min: TranslationMinAggregateInputObjectSchema.optional(),
      _max: TranslationMaxAggregateInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationAggregateArgs>;

export const TranslationAggregateZodSchema = z
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
    _count: z
      .union([z.literal(true), TranslationCountAggregateInputObjectSchema])
      .optional(),
    _min: TranslationMinAggregateInputObjectSchema.optional(),
    _max: TranslationMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
