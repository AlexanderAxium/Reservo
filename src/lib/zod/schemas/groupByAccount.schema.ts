import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { AccountScalarFieldEnumSchema } from "./enums/AccountScalarFieldEnum.schema";
import { AccountCountAggregateInputObjectSchema } from "./objects/AccountCountAggregateInput.schema";
import { AccountMaxAggregateInputObjectSchema } from "./objects/AccountMaxAggregateInput.schema";
import { AccountMinAggregateInputObjectSchema } from "./objects/AccountMinAggregateInput.schema";
import { AccountOrderByWithAggregationInputObjectSchema } from "./objects/AccountOrderByWithAggregationInput.schema";
import { AccountScalarWhereWithAggregatesInputObjectSchema } from "./objects/AccountScalarWhereWithAggregatesInput.schema";
import { AccountWhereInputObjectSchema } from "./objects/AccountWhereInput.schema";

export const AccountGroupBySchema: z.ZodType<Prisma.AccountGroupByArgs> = z
  .object({
    where: AccountWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        AccountOrderByWithAggregationInputObjectSchema,
        AccountOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: AccountScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(AccountScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), AccountCountAggregateInputObjectSchema])
      .optional(),
    _min: AccountMinAggregateInputObjectSchema.optional(),
    _max: AccountMaxAggregateInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.AccountGroupByArgs>;

export const AccountGroupByZodSchema = z
  .object({
    where: AccountWhereInputObjectSchema.optional(),
    orderBy: z
      .union([
        AccountOrderByWithAggregationInputObjectSchema,
        AccountOrderByWithAggregationInputObjectSchema.array(),
      ])
      .optional(),
    having: AccountScalarWhereWithAggregatesInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    by: z.array(AccountScalarFieldEnumSchema),
    _count: z
      .union([z.literal(true), AccountCountAggregateInputObjectSchema])
      .optional(),
    _min: AccountMinAggregateInputObjectSchema.optional(),
    _max: AccountMaxAggregateInputObjectSchema.optional(),
  })
  .strict();
