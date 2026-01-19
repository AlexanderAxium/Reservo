import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionCountAggregateInputObjectSchema } from "./objects/PermissionCountAggregateInput.schema";
import { PermissionMaxAggregateInputObjectSchema } from "./objects/PermissionMaxAggregateInput.schema";
import { PermissionMinAggregateInputObjectSchema } from "./objects/PermissionMinAggregateInput.schema";
import { PermissionOrderByWithRelationInputObjectSchema } from "./objects/PermissionOrderByWithRelationInput.schema";
import { PermissionWhereInputObjectSchema } from "./objects/PermissionWhereInput.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./objects/PermissionWhereUniqueInput.schema";

export const PermissionAggregateSchema: z.ZodType<Prisma.PermissionAggregateArgs> =
  z
    .object({
      orderBy: z
        .union([
          PermissionOrderByWithRelationInputObjectSchema,
          PermissionOrderByWithRelationInputObjectSchema.array(),
        ])
        .optional(),
      where: PermissionWhereInputObjectSchema.optional(),
      cursor: PermissionWhereUniqueInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      _count: z
        .union([z.literal(true), PermissionCountAggregateInputObjectSchema])
        .optional(),
      _min: PermissionMinAggregateInputObjectSchema.optional(),
      _max: PermissionMaxAggregateInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionAggregateArgs>;

export const PermissionAggregateZodSchema = z
  .object({
    orderBy: z
      .union([
        PermissionOrderByWithRelationInputObjectSchema,
        PermissionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: PermissionWhereInputObjectSchema.optional(),
    cursor: PermissionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), PermissionCountAggregateInputObjectSchema])
      .optional(),
    _min: PermissionMinAggregateInputObjectSchema.optional(),
    _max: PermissionMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
