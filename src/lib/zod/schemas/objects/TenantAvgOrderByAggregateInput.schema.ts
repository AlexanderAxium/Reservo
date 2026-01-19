import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      foundedYear: SortOrderSchema.optional(),
    })
    .strict();
export const TenantAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TenantAvgOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantAvgOrderByAggregateInput>;
export const TenantAvgOrderByAggregateInputObjectZodSchema = makeSchema();
