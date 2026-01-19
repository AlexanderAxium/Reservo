import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleCountAggregateInputObjectSchema } from "./objects/UserRoleCountAggregateInput.schema";
import { UserRoleOrderByWithRelationInputObjectSchema } from "./objects/UserRoleOrderByWithRelationInput.schema";
import { UserRoleWhereInputObjectSchema } from "./objects/UserRoleWhereInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./objects/UserRoleWhereUniqueInput.schema";

export const UserRoleCountSchema: z.ZodType<Prisma.UserRoleCountArgs> = z
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
    select: z
      .union([z.literal(true), UserRoleCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.UserRoleCountArgs>;

export const UserRoleCountZodSchema = z
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
    select: z
      .union([z.literal(true), UserRoleCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict();
