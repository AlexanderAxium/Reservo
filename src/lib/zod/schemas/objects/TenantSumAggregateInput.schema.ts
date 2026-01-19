import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      foundedYear: z.literal(true).optional(),
    })
    .strict();
export const TenantSumAggregateInputObjectSchema: z.ZodType<Prisma.TenantSumAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantSumAggregateInputType>;
export const TenantSumAggregateInputObjectZodSchema = makeSchema();
