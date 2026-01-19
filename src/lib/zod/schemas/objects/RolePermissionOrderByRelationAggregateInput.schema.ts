import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      _count: SortOrderSchema.optional(),
    })
    .strict();
export const RolePermissionOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.RolePermissionOrderByRelationAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionOrderByRelationAggregateInput>;
export const RolePermissionOrderByRelationAggregateInputObjectZodSchema =
  makeSchema();
