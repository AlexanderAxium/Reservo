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
export const RoleMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoleMaxOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleMaxOrderByAggregateInput>;
export const RoleMaxOrderByAggregateInputObjectZodSchema = makeSchema();
