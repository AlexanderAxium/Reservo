import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionCountAggregateInputObjectSchema } from "./objects/RolePermissionCountAggregateInput.schema";
import { RolePermissionOrderByWithRelationInputObjectSchema } from "./objects/RolePermissionOrderByWithRelationInput.schema";
import { RolePermissionWhereInputObjectSchema } from "./objects/RolePermissionWhereInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./objects/RolePermissionWhereUniqueInput.schema";

export const RolePermissionCountSchema: z.ZodType<Prisma.RolePermissionCountArgs> =
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
      select: z
        .union([z.literal(true), RolePermissionCountAggregateInputObjectSchema])
        .optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionCountArgs>;

export const RolePermissionCountZodSchema = z
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
    select: z
      .union([z.literal(true), RolePermissionCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict();
