import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantAvgAggregateInputObjectSchema } from "./objects/TenantAvgAggregateInput.schema";
import { TenantCountAggregateInputObjectSchema } from "./objects/TenantCountAggregateInput.schema";
import { TenantMaxAggregateInputObjectSchema } from "./objects/TenantMaxAggregateInput.schema";
import { TenantMinAggregateInputObjectSchema } from "./objects/TenantMinAggregateInput.schema";
import { TenantOrderByWithRelationInputObjectSchema } from "./objects/TenantOrderByWithRelationInput.schema";
import { TenantSumAggregateInputObjectSchema } from "./objects/TenantSumAggregateInput.schema";
import { TenantWhereInputObjectSchema } from "./objects/TenantWhereInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./objects/TenantWhereUniqueInput.schema";

export const TenantAggregateSchema: z.ZodType<Prisma.TenantAggregateArgs> = z
  .object({
    orderBy: z
      .union([
        TenantOrderByWithRelationInputObjectSchema,
        TenantOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: TenantWhereInputObjectSchema.optional(),
    cursor: TenantWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), TenantCountAggregateInputObjectSchema])
      .optional(),
    _min: TenantMinAggregateInputObjectSchema.optional(),
    _max: TenantMaxAggregateInputObjectSchema.optional(),
    _avg: TenantAvgAggregateInputObjectSchema.optional(),
    _sum: TenantSumAggregateInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.TenantAggregateArgs>;

export const TenantAggregateZodSchema = z
  .object({
    orderBy: z
      .union([
        TenantOrderByWithRelationInputObjectSchema,
        TenantOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: TenantWhereInputObjectSchema.optional(),
    cursor: TenantWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), TenantCountAggregateInputObjectSchema])
      .optional(),
    _min: TenantMinAggregateInputObjectSchema.optional(),
    _max: TenantMaxAggregateInputObjectSchema.optional(),
    _avg: TenantAvgAggregateInputObjectSchema.optional(),
    _sum: TenantSumAggregateInputObjectSchema.optional(),
  })
  .strict();
