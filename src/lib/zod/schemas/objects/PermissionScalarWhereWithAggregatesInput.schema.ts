import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";
import { BoolWithAggregatesFilterObjectSchema } from "./BoolWithAggregatesFilter.schema";
import { DateTimeWithAggregatesFilterObjectSchema } from "./DateTimeWithAggregatesFilter.schema";
import { EnumPermissionActionWithAggregatesFilterObjectSchema } from "./EnumPermissionActionWithAggregatesFilter.schema";
import { EnumPermissionResourceWithAggregatesFilterObjectSchema } from "./EnumPermissionResourceWithAggregatesFilter.schema";
import { StringNullableWithAggregatesFilterObjectSchema } from "./StringNullableWithAggregatesFilter.schema";
import { StringWithAggregatesFilterObjectSchema } from "./StringWithAggregatesFilter.schema";

const permissionscalarwherewithaggregatesinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => PermissionScalarWhereWithAggregatesInputObjectSchema),
        z
          .lazy(() => PermissionScalarWhereWithAggregatesInputObjectSchema)
          .array(),
      ])
      .optional(),
    OR: z
      .lazy(() => PermissionScalarWhereWithAggregatesInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => PermissionScalarWhereWithAggregatesInputObjectSchema),
        z
          .lazy(() => PermissionScalarWhereWithAggregatesInputObjectSchema)
          .array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    action: z
      .union([
        z.lazy(() => EnumPermissionActionWithAggregatesFilterObjectSchema),
        PermissionActionSchema,
      ])
      .optional(),
    resource: z
      .union([
        z.lazy(() => EnumPermissionResourceWithAggregatesFilterObjectSchema),
        PermissionResourceSchema,
      ])
      .optional(),
    description: z
      .union([
        z.lazy(() => StringNullableWithAggregatesFilterObjectSchema),
        z.string(),
      ])
      .optional()
      .nullable(),
    isActive: z
      .union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()])
      .optional(),
    createdAt: z
      .union([
        z.lazy(() => DateTimeWithAggregatesFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.lazy(() => DateTimeWithAggregatesFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional(),
    tenantId: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
  })
  .strict();
export const PermissionScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PermissionScalarWhereWithAggregatesInput> =
  permissionscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PermissionScalarWhereWithAggregatesInput>;
export const PermissionScalarWhereWithAggregatesInputObjectZodSchema =
  permissionscalarwherewithaggregatesinputSchema;
