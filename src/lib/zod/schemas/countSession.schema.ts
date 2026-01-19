import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { SessionCountAggregateInputObjectSchema } from "./objects/SessionCountAggregateInput.schema";
import { SessionOrderByWithRelationInputObjectSchema } from "./objects/SessionOrderByWithRelationInput.schema";
import { SessionWhereInputObjectSchema } from "./objects/SessionWhereInput.schema";
import { SessionWhereUniqueInputObjectSchema } from "./objects/SessionWhereUniqueInput.schema";

export const SessionCountSchema: z.ZodType<Prisma.SessionCountArgs> = z
  .object({
    orderBy: z
      .union([
        SessionOrderByWithRelationInputObjectSchema,
        SessionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: SessionWhereInputObjectSchema.optional(),
    cursor: SessionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    select: z
      .union([z.literal(true), SessionCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.SessionCountArgs>;

export const SessionCountZodSchema = z
  .object({
    orderBy: z
      .union([
        SessionOrderByWithRelationInputObjectSchema,
        SessionOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: SessionWhereInputObjectSchema.optional(),
    cursor: SessionWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    select: z
      .union([z.literal(true), SessionCountAggregateInputObjectSchema])
      .optional(),
  })
  .strict();
