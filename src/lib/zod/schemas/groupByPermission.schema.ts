import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionScalarFieldEnumSchema } from "./enums/PermissionScalarFieldEnum.schema";
import { PermissionCountAggregateInputObjectSchema } from "./objects/PermissionCountAggregateInput.schema";
import { PermissionMaxAggregateInputObjectSchema } from "./objects/PermissionMaxAggregateInput.schema";
import { PermissionMinAggregateInputObjectSchema } from "./objects/PermissionMinAggregateInput.schema";
import { PermissionOrderByWithAggregationInputObjectSchema } from "./objects/PermissionOrderByWithAggregationInput.schema";
import { PermissionScalarWhereWithAggregatesInputObjectSchema } from "./objects/PermissionScalarWhereWithAggregatesInput.schema";
import { PermissionWhereInputObjectSchema } from "./objects/PermissionWhereInput.schema";

export const PermissionGroupBySchema: z.ZodType<Prisma.PermissionGroupByArgs> =
  z
    .object({
      where: PermissionWhereInputObjectSchema.optional(),
      orderBy: z
        .union([
          PermissionOrderByWithAggregationInputObjectSchema,
          PermissionOrderByWithAggregationInputObjectSchema.array(),
        ])
        .optional(),
      having: PermissionScalarWhereWithAggregatesInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      by: z.array(PermissionScalarFieldEnumSchema),
      _count: z
        .union([z.literal(true), PermissionCountAggregateInputObjectSchema])
        .optional(),
      _min: PermissionMinAggregateInputObjectSchema.optional(),
      _max: PermissionMaxAggregateInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionGroupByArgs>;

export const PermissionGroupByZodSchema = z
  .object({
    where: PermissionWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        PermissionOrderByWithAggregationInputObjectSchema,
        PermissionOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: PermissionScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(PermissionScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), PermissionCountAggregateInputObjectSchema])
      .optional(),
    _min: PermissionMinAggregateInputObjectSchema.optional(),
    _max: PermissionMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
