import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleAvgAggregateInputObjectSchema } from "./objects/LocaleAvgAggregateInput.schema";
import { LocaleCountAggregateInputObjectSchema } from "./objects/LocaleCountAggregateInput.schema";
import { LocaleMaxAggregateInputObjectSchema } from "./objects/LocaleMaxAggregateInput.schema";
import { LocaleMinAggregateInputObjectSchema } from "./objects/LocaleMinAggregateInput.schema";
import { LocaleOrderByWithRelationInputObjectSchema } from "./objects/LocaleOrderByWithRelationInput.schema";
import { LocaleSumAggregateInputObjectSchema } from "./objects/LocaleSumAggregateInput.schema";
import { LocaleWhereInputObjectSchema } from "./objects/LocaleWhereInput.schema";
import { LocaleWhereUniqueInputObjectSchema } from "./objects/LocaleWhereUniqueInput.schema";

export const LocaleAggregateSchema: z.ZodType<Prisma.LocaleAggregateArgs> = z
  .object({
    orderBy: z
      .union([
        LocaleOrderByWithRelationInputObjectSchema,
        LocaleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: LocaleWhereInputObjectSchema.optional(),
    cursor: LocaleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), LocaleCountAggregateInputObjectSchema])
      .optional(),
    _min: LocaleMinAggregateInputObjectSchema.optional(),
    _max: LocaleMaxAggregateInputObjectSchema.optional(),
    _avg: LocaleAvgAggregateInputObjectSchema.optional(),
    _sum: LocaleSumAggregateInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleAggregateArgs>;

export const LocaleAggregateZodSchema = z
  .object({
    orderBy: z
      .union([
        LocaleOrderByWithRelationInputObjectSchema,
        LocaleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: LocaleWhereInputObjectSchema.optional(),
    cursor: LocaleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), LocaleCountAggregateInputObjectSchema])
      .optional(),
    _min: LocaleMinAggregateInputObjectSchema.optional(),
    _max: LocaleMaxAggregateInputObjectSchema.optional(),
    _avg: LocaleAvgAggregateInputObjectSchema.optional(),
    _sum: LocaleSumAggregateInputObjectSchema.optional(),
  })
  .strict();
