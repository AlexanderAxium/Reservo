import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { RoleCountOrderByAggregateInputObjectSchema } from "./RoleCountOrderByAggregateInput.schema";
import { RoleMaxOrderByAggregateInputObjectSchema } from "./RoleMaxOrderByAggregateInput.schema";
import { RoleMinOrderByAggregateInputObjectSchema } from "./RoleMinOrderByAggregateInput.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      name: SortOrderSchema.optional(),
      displayName: SortOrderSchema.optional(),
      description: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      isActive: SortOrderSchema.optional(),
      isSystem: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      tenantId: SortOrderSchema.optional(),
      _count: z
        .lazy(() => RoleCountOrderByAggregateInputObjectSchema)
        .optional(),
      _max: z.lazy(() => RoleMaxOrderByAggregateInputObjectSchema).optional(),
      _min: z.lazy(() => RoleMinOrderByAggregateInputObjectSchema).optional(),
    })
    .strict();
export const RoleOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RoleOrderByWithAggregationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleOrderByWithAggregationInput>;
export const RoleOrderByWithAggregationInputObjectZodSchema = makeSchema();
