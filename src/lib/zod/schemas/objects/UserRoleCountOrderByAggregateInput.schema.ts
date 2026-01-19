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
export const UserRoleCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UserRoleCountOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleCountOrderByAggregateInput>;
export const UserRoleCountOrderByAggregateInputObjectZodSchema = makeSchema();
