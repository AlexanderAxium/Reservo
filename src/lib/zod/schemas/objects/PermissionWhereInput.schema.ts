import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";
import { BoolFilterObjectSchema } from "./BoolFilter.schema";
import { DateTimeFilterObjectSchema } from "./DateTimeFilter.schema";
import { EnumPermissionActionFilterObjectSchema } from "./EnumPermissionActionFilter.schema";
import { EnumPermissionResourceFilterObjectSchema } from "./EnumPermissionResourceFilter.schema";
import { RolePermissionListRelationFilterObjectSchema } from "./RolePermissionListRelationFilter.schema";
import { StringFilterObjectSchema } from "./StringFilter.schema";
import { StringNullableFilterObjectSchema } from "./StringNullableFilter.schema";
import { TenantScalarRelationFilterObjectSchema } from "./TenantScalarRelationFilter.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";

const permissionwhereinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => PermissionWhereInputObjectSchema),
        z.lazy(() => PermissionWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => PermissionWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => PermissionWhereInputObjectSchema),
        z.lazy(() => PermissionWhereInputObjectSchema).array(),
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
    tenant: z
      .union([
        z.lazy(() => TenantScalarRelationFilterObjectSchema),
        z.lazy(() => TenantWhereInputObjectSchema),
      ])
      .optional(),
    rolePermissions: z
      .lazy(() => RolePermissionListRelationFilterObjectSchema)
      .optional(),
  })
  .strict();
export const PermissionWhereInputObjectSchema: z.ZodType<Prisma.PermissionWhereInput> =
  permissionwhereinputSchema as unknown as z.ZodType<Prisma.PermissionWhereInput>;
export const PermissionWhereInputObjectZodSchema = permissionwhereinputSchema;
