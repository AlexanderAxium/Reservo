import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      _count: SortOrderSchema.optional(),
    })
    .strict();
export const PermissionOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.PermissionOrderByRelationAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionOrderByRelationAggregateInput>;
export const PermissionOrderByRelationAggregateInputObjectZodSchema =
  makeSchema();
