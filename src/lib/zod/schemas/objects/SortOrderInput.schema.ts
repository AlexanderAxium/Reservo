import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { NullsOrderSchema } from "../enums/NullsOrder.schema";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      sort: SortOrderSchema,
      nulls: NullsOrderSchema.optional(),
    })
    .strict();
export const SortOrderInputObjectSchema: z.ZodType<Prisma.SortOrderInput> =
  makeSchema() as unknown as z.ZodType<Prisma.SortOrderInput>;
export const SortOrderInputObjectZodSchema = makeSchema();
