import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      userId: SortOrderSchema.optional(),
      roleId: SortOrderSchema.optional(),
      assignedAt: SortOrderSchema.optional(),
      assignedBy: SortOrderSchema.optional(),
      expiresAt: SortOrderSchema.optional(),
    })
    .strict();
export const UserRoleMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UserRoleMaxOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleMaxOrderByAggregateInput>;
export const UserRoleMaxOrderByAggregateInputObjectZodSchema = makeSchema();
