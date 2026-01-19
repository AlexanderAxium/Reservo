import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RoleCountAggregateInputObjectSchema } from "./objects/RoleCountAggregateInput.schema";
import { RoleMaxAggregateInputObjectSchema } from "./objects/RoleMaxAggregateInput.schema";
import { RoleMinAggregateInputObjectSchema } from "./objects/RoleMinAggregateInput.schema";
import { RoleOrderByWithRelationInputObjectSchema } from "./objects/RoleOrderByWithRelationInput.schema";
import { RoleWhereInputObjectSchema } from "./objects/RoleWhereInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./objects/RoleWhereUniqueInput.schema";

export const RoleAggregateSchema: z.ZodType<Prisma.RoleAggregateArgs> = z
  .object({
    orderBy: z
      .union([
        RoleOrderByWithRelationInputObjectSchema,
        RoleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: RoleWhereInputObjectSchema.optional(),
    cursor: RoleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), RoleCountAggregateInputObjectSchema])
      .optional(),
    _min: RoleMinAggregateInputObjectSchema.optional(),
    _max: RoleMaxAggregateInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.RoleAggregateArgs>;

export const RoleAggregateZodSchema = z
  .object({
    orderBy: z
      .union([
        RoleOrderByWithRelationInputObjectSchema,
        RoleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: RoleWhereInputObjectSchema.optional(),
    cursor: RoleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), RoleCountAggregateInputObjectSchema])
      .optional(),
    _min: RoleMinAggregateInputObjectSchema.optional(),
    _max: RoleMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
