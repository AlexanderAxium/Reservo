import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      roleId: SortOrderSchema.optional(),
      permissionId: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
    })
    .strict();
export const RolePermissionMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RolePermissionMinOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionMinOrderByAggregateInput>;
export const RolePermissionMinOrderByAggregateInputObjectZodSchema =
  makeSchema();
