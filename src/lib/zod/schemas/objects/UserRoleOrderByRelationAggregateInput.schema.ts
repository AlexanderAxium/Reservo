import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      _count: SortOrderSchema.optional(),
    })
    .strict();
export const UserRoleOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.UserRoleOrderByRelationAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleOrderByRelationAggregateInput>;
export const UserRoleOrderByRelationAggregateInputObjectZodSchema =
  makeSchema();
