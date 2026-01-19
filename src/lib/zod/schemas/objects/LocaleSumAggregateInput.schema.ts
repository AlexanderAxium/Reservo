import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      displayOrder: z.literal(true).optional(),
    })
    .strict();
export const LocaleSumAggregateInputObjectSchema: z.ZodType<Prisma.LocaleSumAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleSumAggregateInputType>;
export const LocaleSumAggregateInputObjectZodSchema = makeSchema();
