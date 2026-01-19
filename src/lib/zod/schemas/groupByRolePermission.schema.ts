import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionScalarFieldEnumSchema } from "./enums/RolePermissionScalarFieldEnum.schema";
import { RolePermissionCountAggregateInputObjectSchema } from "./objects/RolePermissionCountAggregateInput.schema";
import { RolePermissionMaxAggregateInputObjectSchema } from "./objects/RolePermissionMaxAggregateInput.schema";
import { RolePermissionMinAggregateInputObjectSchema } from "./objects/RolePermissionMinAggregateInput.schema";
import { RolePermissionOrderByWithAggregationInputObjectSchema } from "./objects/RolePermissionOrderByWithAggregationInput.schema";
import { RolePermissionScalarWhereWithAggregatesInputObjectSchema } from "./objects/RolePermissionScalarWhereWithAggregatesInput.schema";
import { RolePermissionWhereInputObjectSchema } from "./objects/RolePermissionWhereInput.schema";

export const RolePermissionGroupBySchema: z.ZodType<Prisma.RolePermissionGroupByArgs> =
  z
    .object({
      where: RolePermissionWhereInputObjectSchema.optional(),
      orderBy: z
        .union([
          RolePermissionOrderByWithAggregationInputObjectSchema,
          RolePermissionOrderByWithAggregationInputObjectSchema.array(),
        ])
        .optional(),
      having:
        RolePermissionScalarWhereWithAggregatesInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      by: z.array(RolePermissionScalarFieldEnumSchema),
      _count: z
        .union([z.literal(true), RolePermissionCountAggregateInputObjectSchema])
        .optional(),
      _min: RolePermissionMinAggregateInputObjectSchema.optional(),
      _max: RolePermissionMaxAggregateInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionGroupByArgs>;

export const RolePermissionGroupByZodSchema = z
  .object({
    where: RolePermissionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        RolePermissionOrderByWithAggregationInputObjectSchema,
        RolePermissionOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: RolePermissionScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(RolePermissionScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), RolePermissionCountAggregateInputObjectSchema])
      .optional(),
    _min: RolePermissionMinAggregateInputObjectSchema.optional(),
    _max: RolePermissionMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
