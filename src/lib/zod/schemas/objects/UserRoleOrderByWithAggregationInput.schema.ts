import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";
import { UserRoleCountOrderByAggregateInputObjectSchema } from "./UserRoleCountOrderByAggregateInput.schema";
import { UserRoleMaxOrderByAggregateInputObjectSchema } from "./UserRoleMaxOrderByAggregateInput.schema";
import { UserRoleMinOrderByAggregateInputObjectSchema } from "./UserRoleMinOrderByAggregateInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      userId: SortOrderSchema.optional(),
      roleId: SortOrderSchema.optional(),
      assignedAt: SortOrderSchema.optional(),
      assignedBy: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      expiresAt: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      _count: z
        .lazy(() => UserRoleCountOrderByAggregateInputObjectSchema)
        .optional(),
      _max: z
        .lazy(() => UserRoleMaxOrderByAggregateInputObjectSchema)
        .optional(),
      _min: z
        .lazy(() => UserRoleMinOrderByAggregateInputObjectSchema)
        .optional(),
    })
    .strict();
export const UserRoleOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.UserRoleOrderByWithAggregationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleOrderByWithAggregationInput>;
export const UserRoleOrderByWithAggregationInputObjectZodSchema = makeSchema();
