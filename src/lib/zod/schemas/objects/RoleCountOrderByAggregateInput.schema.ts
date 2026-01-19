import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      name: SortOrderSchema.optional(),
      displayName: SortOrderSchema.optional(),
      description: SortOrderSchema.optional(),
      isActive: SortOrderSchema.optional(),
      isSystem: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      tenantId: SortOrderSchema.optional(),
    })
    .strict();
export const RoleCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoleCountOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCountOrderByAggregateInput>;
export const RoleCountOrderByAggregateInputObjectZodSchema = makeSchema();
