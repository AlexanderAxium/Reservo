import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      _count: SortOrderSchema.optional(),
    })
    .strict();
export const TranslationOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TranslationOrderByRelationAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationOrderByRelationAggregateInput>;
export const TranslationOrderByRelationAggregateInputObjectZodSchema =
  makeSchema();
