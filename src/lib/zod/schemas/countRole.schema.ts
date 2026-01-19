import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RoleCountAggregateInputObjectSchema } from "./objects/RoleCountAggregateInput.schema";
import { RoleOrderByWithRelationInputObjectSchema } from "./objects/RoleOrderByWithRelationInput.schema";
import { RoleWhereInputObjectSchema } from "./objects/RoleWhereInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./objects/RoleWhereUniqueInput.schema";

export const RoleCountSchema: z.ZodType<Prisma.RoleCountArgs> = z
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
    select: z
      .union([z.literal(true), RoleCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.RoleCountArgs>;

export const RoleCountZodSchema = z
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
    select: z
      .union([z.literal(true), RoleCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict();
