import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { PermissionCountOrderByAggregateInputObjectSchema } from "./PermissionCountOrderByAggregateInput.schema";
import { PermissionMaxOrderByAggregateInputObjectSchema } from "./PermissionMaxOrderByAggregateInput.schema";
import { PermissionMinOrderByAggregateInputObjectSchema } from "./PermissionMinOrderByAggregateInput.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      action: SortOrderSchema.optional(),
      resource: SortOrderSchema.optional(),
      description: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      isActive: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      tenantId: SortOrderSchema.optional(),
      _count: z
        .lazy(() => PermissionCountOrderByAggregateInputObjectSchema)
        .optional(),
      _max: z
        .lazy(() => PermissionMaxOrderByAggregateInputObjectSchema)
        .optional(),
      _min: z
        .lazy(() => PermissionMinOrderByAggregateInputObjectSchema)
        .optional(),
    })
    .strict();
export const PermissionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.PermissionOrderByWithAggregationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionOrderByWithAggregationInput>;
export const PermissionOrderByWithAggregationInputObjectZodSchema =
  makeSchema();
