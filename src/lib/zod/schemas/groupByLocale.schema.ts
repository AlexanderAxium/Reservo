import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleScalarFieldEnumSchema } from "./enums/LocaleScalarFieldEnum.schema";
import { LocaleAvgAggregateInputObjectSchema } from "./objects/LocaleAvgAggregateInput.schema";
import { LocaleCountAggregateInputObjectSchema } from "./objects/LocaleCountAggregateInput.schema";
import { LocaleMaxAggregateInputObjectSchema } from "./objects/LocaleMaxAggregateInput.schema";
import { LocaleMinAggregateInputObjectSchema } from "./objects/LocaleMinAggregateInput.schema";
import { LocaleOrderByWithAggregationInputObjectSchema } from "./objects/LocaleOrderByWithAggregationInput.schema";
import { LocaleScalarWhereWithAggregatesInputObjectSchema } from "./objects/LocaleScalarWhereWithAggregatesInput.schema";
import { LocaleSumAggregateInputObjectSchema } from "./objects/LocaleSumAggregateInput.schema";
import { LocaleWhereInputObjectSchema } from "./objects/LocaleWhereInput.schema";

export const LocaleGroupBySchema: z.ZodType<Prisma.LocaleGroupByArgs> = z
  .object({
    where: LocaleWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        LocaleOrderByWithAggregationInputObjectSchema,
        LocaleOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: LocaleScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(LocaleScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), LocaleCountAggregateInputObjectSchema])
      .optional(),
    _min: LocaleMinAggregateInputObjectSchema.optional(),
    _max: LocaleMaxAggregateInputObjectSchema.optional(),
    _avg: LocaleAvgAggregateInputObjectSchema.optional(),
    _sum: LocaleSumAggregateInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleGroupByArgs>;

export const LocaleGroupByZodSchema = z
  .object({
    where: LocaleWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        LocaleOrderByWithAggregationInputObjectSchema,
        LocaleOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: LocaleScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(LocaleScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), LocaleCountAggregateInputObjectSchema])
      .optional(),
    _min: LocaleMinAggregateInputObjectSchema.optional(),
    _max: LocaleMaxAggregateInputObjectSchema.optional(),
    _avg: LocaleAvgAggregateInputObjectSchema.optional(),
    _sum: LocaleSumAggregateInputObjectSchema.optional(),
  })
  .strict();
