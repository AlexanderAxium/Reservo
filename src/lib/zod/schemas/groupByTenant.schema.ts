import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantScalarFieldEnumSchema } from "./enums/TenantScalarFieldEnum.schema";
import { TenantAvgAggregateInputObjectSchema } from "./objects/TenantAvgAggregateInput.schema";
import { TenantCountAggregateInputObjectSchema } from "./objects/TenantCountAggregateInput.schema";
import { TenantMaxAggregateInputObjectSchema } from "./objects/TenantMaxAggregateInput.schema";
import { TenantMinAggregateInputObjectSchema } from "./objects/TenantMinAggregateInput.schema";
import { TenantOrderByWithAggregationInputObjectSchema } from "./objects/TenantOrderByWithAggregationInput.schema";
import { TenantScalarWhereWithAggregatesInputObjectSchema } from "./objects/TenantScalarWhereWithAggregatesInput.schema";
import { TenantSumAggregateInputObjectSchema } from "./objects/TenantSumAggregateInput.schema";
import { TenantWhereInputObjectSchema } from "./objects/TenantWhereInput.schema";

export const TenantGroupBySchema: z.ZodType<Prisma.TenantGroupByArgs> = z
  .object({
    where: TenantWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        TenantOrderByWithAggregationInputObjectSchema,
        TenantOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: TenantScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(TenantScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), TenantCountAggregateInputObjectSchema])
      .optional(),
    _min: TenantMinAggregateInputObjectSchema.optional(),
    _max: TenantMaxAggregateInputObjectSchema.optional(),
    _avg: TenantAvgAggregateInputObjectSchema.optional(),
    _sum: TenantSumAggregateInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.TenantGroupByArgs>;

export const TenantGroupByZodSchema = z
  .object({
    where: TenantWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        TenantOrderByWithAggregationInputObjectSchema,
        TenantOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: TenantScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(TenantScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), TenantCountAggregateInputObjectSchema])
      .optional(),
    _min: TenantMinAggregateInputObjectSchema.optional(),
    _max: TenantMaxAggregateInputObjectSchema.optional(),
    _avg: TenantAvgAggregateInputObjectSchema.optional(),
    _sum: TenantSumAggregateInputObjectSchema.optional(),
  })
  .strict();
