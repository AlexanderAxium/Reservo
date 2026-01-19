import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      displayOrder: SortOrderSchema.optional(),
    })
    .strict();
export const LocaleAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.LocaleAvgOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleAvgOrderByAggregateInput>;
export const LocaleAvgOrderByAggregateInputObjectZodSchema = makeSchema();
