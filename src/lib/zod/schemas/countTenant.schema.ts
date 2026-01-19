import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantCountAggregateInputObjectSchema } from "./objects/TenantCountAggregateInput.schema";
import { TenantOrderByWithRelationInputObjectSchema } from "./objects/TenantOrderByWithRelationInput.schema";
import { TenantWhereInputObjectSchema } from "./objects/TenantWhereInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./objects/TenantWhereUniqueInput.schema";

export const TenantCountSchema: z.ZodType<Prisma.TenantCountArgs> = z
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
    select: z
      .union([z.literal(true), TenantCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.TenantCountArgs>;

export const TenantCountZodSchema = z
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
    select: z
      .union([z.literal(true), TenantCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict();
