import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";
import { BoolFilterObjectSchema } from "./BoolFilter.schema";
import { DateTimeFilterObjectSchema } from "./DateTimeFilter.schema";
import { EnumPermissionActionFilterObjectSchema } from "./EnumPermissionActionFilter.schema";
import { EnumPermissionResourceFilterObjectSchema } from "./EnumPermissionResourceFilter.schema";
import { StringFilterObjectSchema } from "./StringFilter.schema";
import { StringNullableFilterObjectSchema } from "./StringNullableFilter.schema";

const permissionscalarwhereinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => PermissionScalarWhereInputObjectSchema),
        z.lazy(() => PermissionScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => PermissionScalarWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => PermissionScalarWhereInputObjectSchema),
        z.lazy(() => PermissionScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    action: z
      .union([
        z.lazy(() => EnumPermissionActionFilterObjectSchema),
        PermissionActionSchema,
      ])
      .optional(),
    resource: z
      .union([
        z.lazy(() => EnumPermissionResourceFilterObjectSchema),
        PermissionResourceSchema,
      ])
      .optional(),
    description: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    isActive: z
      .union([z.lazy(() => BoolFilterObjectSchema), z.boolean()])
      .optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
    tenantId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
  })
  .strict();
export const PermissionScalarWhereInputObjectSchema: z.ZodType<Prisma.PermissionScalarWhereInput> =
  permissionscalarwhereinputSchema as unknown as z.ZodType<Prisma.PermissionScalarWhereInput>;
export const PermissionScalarWhereInputObjectZodSchema =
  permissionscalarwhereinputSchema;
