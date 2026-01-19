import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { BoolFilterObjectSchema } from "./BoolFilter.schema";
import { DateTimeFilterObjectSchema } from "./DateTimeFilter.schema";
import { RolePermissionListRelationFilterObjectSchema } from "./RolePermissionListRelationFilter.schema";
import { StringFilterObjectSchema } from "./StringFilter.schema";
import { StringNullableFilterObjectSchema } from "./StringNullableFilter.schema";
import { TenantScalarRelationFilterObjectSchema } from "./TenantScalarRelationFilter.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";
import { UserRoleListRelationFilterObjectSchema } from "./UserRoleListRelationFilter.schema";

const rolewhereinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => RoleWhereInputObjectSchema),
        z.lazy(() => RoleWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => RoleWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => RoleWhereInputObjectSchema),
        z.lazy(() => RoleWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    displayName: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    description: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    isActive: z
      .union([z.lazy(() => BoolFilterObjectSchema), z.boolean()])
      .optional(),
    isSystem: z
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
    rolePermissions: z
      .lazy(() => RolePermissionListRelationFilterObjectSchema)
      .optional(),
    tenant: z
      .union([
        z.lazy(() => TenantScalarRelationFilterObjectSchema),
        z.lazy(() => TenantWhereInputObjectSchema),
      ])
      .optional(),
    userRoles: z.lazy(() => UserRoleListRelationFilterObjectSchema).optional(),
  })
  .strict();
export const RoleWhereInputObjectSchema: z.ZodType<Prisma.RoleWhereInput> =
  rolewhereinputSchema as unknown as z.ZodType<Prisma.RoleWhereInput>;
export const RoleWhereInputObjectZodSchema = rolewhereinputSchema;
