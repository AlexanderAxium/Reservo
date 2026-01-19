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
export const RolePermissionCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RolePermissionCountOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCountOrderByAggregateInput>;
export const RolePermissionCountOrderByAggregateInputObjectZodSchema =
  makeSchema();
