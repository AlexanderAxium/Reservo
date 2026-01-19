import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      displayOrder: SortOrderSchema.optional(),
    })
    .strict();
export const LocaleSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.LocaleSumOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleSumOrderByAggregateInput>;
export const LocaleSumOrderByAggregateInputObjectZodSchema = makeSchema();
