import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { SessionCountOrderByAggregateInputObjectSchema } from "./SessionCountOrderByAggregateInput.schema";
import { SessionMaxOrderByAggregateInputObjectSchema } from "./SessionMaxOrderByAggregateInput.schema";
import { SessionMinOrderByAggregateInputObjectSchema } from "./SessionMinOrderByAggregateInput.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      userId: SortOrderSchema.optional(),
      token: SortOrderSchema.optional(),
      expiresAt: SortOrderSchema.optional(),
      ipAddress: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      userAgent: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      _count: z
        .lazy(() => SessionCountOrderByAggregateInputObjectSchema)
        .optional(),
      _max: z
        .lazy(() => SessionMaxOrderByAggregateInputObjectSchema)
        .optional(),
      _min: z
        .lazy(() => SessionMinOrderByAggregateInputObjectSchema)
        .optional(),
    })
    .strict();
export const SessionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.SessionOrderByWithAggregationInput>;
export const SessionOrderByWithAggregationInputObjectZodSchema = makeSchema();
