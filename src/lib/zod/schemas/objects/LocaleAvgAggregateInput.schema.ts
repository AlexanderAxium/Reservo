import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      displayOrder: z.literal(true).optional(),
    })
    .strict();
export const LocaleAvgAggregateInputObjectSchema: z.ZodType<Prisma.LocaleAvgAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleAvgAggregateInputType>;
export const LocaleAvgAggregateInputObjectZodSchema = makeSchema();
