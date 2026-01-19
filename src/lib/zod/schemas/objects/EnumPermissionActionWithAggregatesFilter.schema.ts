import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { NestedEnumPermissionActionFilterObjectSchema } from "./NestedEnumPermissionActionFilter.schema";
import { NestedEnumPermissionActionWithAggregatesFilterObjectSchema } from "./NestedEnumPermissionActionWithAggregatesFilter.schema";
import { NestedIntFilterObjectSchema } from "./NestedIntFilter.schema";

const makeSchema = () =>
  z
    .object({
      equals: PermissionActionSchema.optional(),
      in: PermissionActionSchema.array().optional(),
      notIn: PermissionActionSchema.array().optional(),
      not: z
        .union([
          PermissionActionSchema,
          z.lazy(
            () => NestedEnumPermissionActionWithAggregatesFilterObjectSchema
          ),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
      _min: z
        .lazy(() => NestedEnumPermissionActionFilterObjectSchema)
        .optional(),
      _max: z
        .lazy(() => NestedEnumPermissionActionFilterObjectSchema)
        .optional(),
    })
    .strict();
export const EnumPermissionActionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPermissionActionWithAggregatesFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumPermissionActionWithAggregatesFilter>;
export const EnumPermissionActionWithAggregatesFilterObjectZodSchema =
  makeSchema();
