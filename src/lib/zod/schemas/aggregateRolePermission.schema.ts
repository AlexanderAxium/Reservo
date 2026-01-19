import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionCountAggregateInputObjectSchema } from "./objects/RolePermissionCountAggregateInput.schema";
import { RolePermissionMaxAggregateInputObjectSchema } from "./objects/RolePermissionMaxAggregateInput.schema";
import { RolePermissionMinAggregateInputObjectSchema } from "./objects/RolePermissionMinAggregateInput.schema";
import { RolePermissionOrderByWithRelationInputObjectSchema } from "./objects/RolePermissionOrderByWithRelationInput.schema";
import { RolePermissionWhereInputObjectSchema } from "./objects/RolePermissionWhereInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./objects/RolePermissionWhereUniqueInput.schema";

export const RolePermissionAggregateSchema: z.ZodType<Prisma.RolePermissionAggregateArgs> =
  z
    .object({
      orderBy: z
        .union([
          RolePermissionOrderByWithRelationInputObjectSchema,
          RolePermissionOrderByWithRelationInputObjectSchema.array(),
        ])
        .optional(),
      where: RolePermissionWhereInputObjectSchema.optional(),
      cursor: RolePermissionWhereUniqueInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      _count: z
        .union([z.literal(true), RolePermissionCountAggregateInputObjectSchema])
        .optional(),
      _min: RolePermissionMinAggregateInputObjectSchema.optional(),
      _max: RolePermissionMaxAggregateInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionAggregateArgs>;

export const RolePermissionAggregateZodSchema = z
  .object({
    orderBy: z
      .union([
        RolePermissionOrderByWithRelationInputObjectSchema,
        RolePermissionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: RolePermissionWhereInputObjectSchema.optional(),
    cursor: RolePermissionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), RolePermissionCountAggregateInputObjectSchema])
      .optional(),
    _min: RolePermissionMinAggregateInputObjectSchema.optional(),
    _max: RolePermissionMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
