import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      action: SortOrderSchema.optional(),
      resource: SortOrderSchema.optional(),
      description: SortOrderSchema.optional(),
      isActive: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      tenantId: SortOrderSchema.optional(),
    })
    .strict();
export const PermissionMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PermissionMaxOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionMaxOrderByAggregateInput>;
export const PermissionMaxOrderByAggregateInputObjectZodSchema = makeSchema();
