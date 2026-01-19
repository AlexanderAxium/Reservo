import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleScalarFieldEnumSchema } from "./enums/UserRoleScalarFieldEnum.schema";
import { UserRoleCountAggregateInputObjectSchema } from "./objects/UserRoleCountAggregateInput.schema";
import { UserRoleMaxAggregateInputObjectSchema } from "./objects/UserRoleMaxAggregateInput.schema";
import { UserRoleMinAggregateInputObjectSchema } from "./objects/UserRoleMinAggregateInput.schema";
import { UserRoleOrderByWithAggregationInputObjectSchema } from "./objects/UserRoleOrderByWithAggregationInput.schema";
import { UserRoleScalarWhereWithAggregatesInputObjectSchema } from "./objects/UserRoleScalarWhereWithAggregatesInput.schema";
import { UserRoleWhereInputObjectSchema } from "./objects/UserRoleWhereInput.schema";

export const UserRoleGroupBySchema: z.ZodType<Prisma.UserRoleGroupByArgs> = z
  .object({
    where: UserRoleWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        UserRoleOrderByWithAggregationInputObjectSchema,
        UserRoleOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: UserRoleScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(UserRoleScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), UserRoleCountAggregateInputObjectSchema])
      .optional(),
    _min: UserRoleMinAggregateInputObjectSchema.optional(),
    _max: UserRoleMaxAggregateInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.UserRoleGroupByArgs>;

export const UserRoleGroupByZodSchema = z
  .object({
    where: UserRoleWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        UserRoleOrderByWithAggregationInputObjectSchema,
        UserRoleOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: UserRoleScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(UserRoleScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), UserRoleCountAggregateInputObjectSchema])
      .optional(),
    _min: UserRoleMinAggregateInputObjectSchema.optional(),
    _max: UserRoleMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
