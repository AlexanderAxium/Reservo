import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleCountAggregateInputObjectSchema } from "./objects/LocaleCountAggregateInput.schema";
import { LocaleOrderByWithRelationInputObjectSchema } from "./objects/LocaleOrderByWithRelationInput.schema";
import { LocaleWhereInputObjectSchema } from "./objects/LocaleWhereInput.schema";
import { LocaleWhereUniqueInputObjectSchema } from "./objects/LocaleWhereUniqueInput.schema";

export const LocaleCountSchema: z.ZodType<Prisma.LocaleCountArgs> = z
  .object({
    orderBy: z
      .union([
        LocaleOrderByWithRelationInputObjectSchema,
        LocaleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: LocaleWhereInputObjectSchema.optional(),
    cursor: LocaleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    select: z
      .union([z.literal(true), LocaleCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleCountArgs>;

export const LocaleCountZodSchema = z
  .object({
    orderBy: z
      .union([
        LocaleOrderByWithRelationInputObjectSchema,
        LocaleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: LocaleWhereInputObjectSchema.optional(),
    cursor: LocaleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    select: z
      .union([z.literal(true), LocaleCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict();
