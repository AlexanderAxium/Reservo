import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationScalarFieldEnumSchema } from "./enums/TranslationScalarFieldEnum.schema";
import { TranslationCountAggregateInputObjectSchema } from "./objects/TranslationCountAggregateInput.schema";
import { TranslationMaxAggregateInputObjectSchema } from "./objects/TranslationMaxAggregateInput.schema";
import { TranslationMinAggregateInputObjectSchema } from "./objects/TranslationMinAggregateInput.schema";
import { TranslationOrderByWithAggregationInputObjectSchema } from "./objects/TranslationOrderByWithAggregationInput.schema";
import { TranslationScalarWhereWithAggregatesInputObjectSchema } from "./objects/TranslationScalarWhereWithAggregatesInput.schema";
import { TranslationWhereInputObjectSchema } from "./objects/TranslationWhereInput.schema";

export const TranslationGroupBySchema: z.ZodType<Prisma.TranslationGroupByArgs> =
  z
    .object({
      where: TranslationWhereInputObjectSchema.optional(),
      orderBy: z
        .union([
          TranslationOrderByWithAggregationInputObjectSchema,
          TranslationOrderByWithAggregationInputObjectSchema.array(),
        ])
        .optional(),
      having: TranslationScalarWhereWithAggregatesInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      by: z.array(TranslationScalarFieldEnumSchema),
      _count: z
        .union([z.literal(true), TranslationCountAggregateInputObjectSchema])
        .optional(),
      _min: TranslationMinAggregateInputObjectSchema.optional(),
      _max: TranslationMaxAggregateInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationGroupByArgs>;

export const TranslationGroupByZodSchema = z
  .object({
    where: TranslationWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        TranslationOrderByWithAggregationInputObjectSchema,
        TranslationOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: TranslationScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(TranslationScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), TranslationCountAggregateInputObjectSchema])
      .optional(),
    _min: TranslationMinAggregateInputObjectSchema.optional(),
    _max: TranslationMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
