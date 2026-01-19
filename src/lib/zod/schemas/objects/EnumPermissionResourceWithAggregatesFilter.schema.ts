import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";
import { NestedEnumPermissionResourceFilterObjectSchema } from "./NestedEnumPermissionResourceFilter.schema";
import { NestedEnumPermissionResourceWithAggregatesFilterObjectSchema } from "./NestedEnumPermissionResourceWithAggregatesFilter.schema";
import { NestedIntFilterObjectSchema } from "./NestedIntFilter.schema";

const makeSchema = () =>
  z
    .object({
      equals: PermissionResourceSchema.optional(),
      in: PermissionResourceSchema.array().optional(),
      notIn: PermissionResourceSchema.array().optional(),
      not: z
        .union([
          PermissionResourceSchema,
          z.lazy(
            () => NestedEnumPermissionResourceWithAggregatesFilterObjectSchema
          ),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
      _min: z
        .lazy(() => NestedEnumPermissionResourceFilterObjectSchema)
        .optional(),
      _max: z
        .lazy(() => NestedEnumPermissionResourceFilterObjectSchema)
        .optional(),
    })
    .strict();
export const EnumPermissionResourceWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPermissionResourceWithAggregatesFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumPermissionResourceWithAggregatesFilter>;
export const EnumPermissionResourceWithAggregatesFilterObjectZodSchema =
  makeSchema();
