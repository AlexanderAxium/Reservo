import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { NestedEnumPermissionActionFilterObjectSchema } from "./NestedEnumPermissionActionFilter.schema";
import { NestedIntFilterObjectSchema } from "./NestedIntFilter.schema";

const nestedenumpermissionactionwithaggregatesfilterSchema = z
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
    _min: z.lazy(() => NestedEnumPermissionActionFilterObjectSchema).optional(),
    _max: z.lazy(() => NestedEnumPermissionActionFilterObjectSchema).optional(),
  })
  .strict();
export const NestedEnumPermissionActionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPermissionActionWithAggregatesFilter> =
  nestedenumpermissionactionwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPermissionActionWithAggregatesFilter>;
export const NestedEnumPermissionActionWithAggregatesFilterObjectZodSchema =
  nestedenumpermissionactionwithaggregatesfilterSchema;
