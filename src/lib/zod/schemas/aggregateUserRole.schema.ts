import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleCountAggregateInputObjectSchema } from "./objects/UserRoleCountAggregateInput.schema";
import { UserRoleMaxAggregateInputObjectSchema } from "./objects/UserRoleMaxAggregateInput.schema";
import { UserRoleMinAggregateInputObjectSchema } from "./objects/UserRoleMinAggregateInput.schema";
import { UserRoleOrderByWithRelationInputObjectSchema } from "./objects/UserRoleOrderByWithRelationInput.schema";
import { UserRoleWhereInputObjectSchema } from "./objects/UserRoleWhereInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./objects/UserRoleWhereUniqueInput.schema";

export const UserRoleAggregateSchema: z.ZodType<Prisma.UserRoleAggregateArgs> =
  z
    .object({
      orderBy: z
        .union([
          UserRoleOrderByWithRelationInputObjectSchema,
          UserRoleOrderByWithRelationInputObjectSchema.array(),
        ])
        .optional(),
      where: UserRoleWhereInputObjectSchema.optional(),
      cursor: UserRoleWhereUniqueInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      _count: z
        .union([z.literal(true), UserRoleCountAggregateInputObjectSchema])
        .optional(),
      _min: UserRoleMinAggregateInputObjectSchema.optional(),
      _max: UserRoleMaxAggregateInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserRoleAggregateArgs>;

export const UserRoleAggregateZodSchema = z
  .object({
    orderBy: z
      .union([
        UserRoleOrderByWithRelationInputObjectSchema,
        UserRoleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: UserRoleWhereInputObjectSchema.optional(),
    cursor: UserRoleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    _count: z
      .union([z.literal(true), UserRoleCountAggregateInputObjectSchema])
      .optional(),
    _min: UserRoleMinAggregateInputObjectSchema.optional(),
    _max: UserRoleMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
