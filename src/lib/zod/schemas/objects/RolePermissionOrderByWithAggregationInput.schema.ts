import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { RolePermissionCountOrderByAggregateInputObjectSchema } from "./RolePermissionCountOrderByAggregateInput.schema";
import { RolePermissionMaxOrderByAggregateInputObjectSchema } from "./RolePermissionMaxOrderByAggregateInput.schema";
import { RolePermissionMinOrderByAggregateInputObjectSchema } from "./RolePermissionMinOrderByAggregateInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      roleId: SortOrderSchema.optional(),
      permissionId: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      _count: z
        .lazy(() => RolePermissionCountOrderByAggregateInputObjectSchema)
        .optional(),
      _max: z
        .lazy(() => RolePermissionMaxOrderByAggregateInputObjectSchema)
        .optional(),
      _min: z
        .lazy(() => RolePermissionMinOrderByAggregateInputObjectSchema)
        .optional(),
    })
    .strict();
export const RolePermissionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RolePermissionOrderByWithAggregationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionOrderByWithAggregationInput>;
export const RolePermissionOrderByWithAggregationInputObjectZodSchema =
  makeSchema();
