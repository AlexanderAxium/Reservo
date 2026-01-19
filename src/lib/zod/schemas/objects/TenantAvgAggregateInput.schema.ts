import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      foundedYear: z.literal(true).optional(),
    })
    .strict();
export const TenantAvgAggregateInputObjectSchema: z.ZodType<Prisma.TenantAvgAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantAvgAggregateInputType>;
export const TenantAvgAggregateInputObjectZodSchema = makeSchema();
