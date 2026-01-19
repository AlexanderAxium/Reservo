import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RoleScalarFieldEnumSchema } from "./enums/RoleScalarFieldEnum.schema";
import { RoleCountAggregateInputObjectSchema } from "./objects/RoleCountAggregateInput.schema";
import { RoleMaxAggregateInputObjectSchema } from "./objects/RoleMaxAggregateInput.schema";
import { RoleMinAggregateInputObjectSchema } from "./objects/RoleMinAggregateInput.schema";
import { RoleOrderByWithAggregationInputObjectSchema } from "./objects/RoleOrderByWithAggregationInput.schema";
import { RoleScalarWhereWithAggregatesInputObjectSchema } from "./objects/RoleScalarWhereWithAggregatesInput.schema";
import { RoleWhereInputObjectSchema } from "./objects/RoleWhereInput.schema";

export const RoleGroupBySchema: z.ZodType<Prisma.RoleGroupByArgs> = z
  .object({
    where: RoleWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        RoleOrderByWithAggregationInputObjectSchema,
        RoleOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: RoleScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(RoleScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), RoleCountAggregateInputObjectSchema])
      .optional(),
    _min: RoleMinAggregateInputObjectSchema.optional(),
    _max: RoleMaxAggregateInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.RoleGroupByArgs>;

export const RoleGroupByZodSchema = z
  .object({
    where: RoleWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        RoleOrderByWithAggregationInputObjectSchema,
        RoleOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: RoleScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(RoleScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), RoleCountAggregateInputObjectSchema])
      .optional(),
    _min: RoleMinAggregateInputObjectSchema.optional(),
    _max: RoleMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
