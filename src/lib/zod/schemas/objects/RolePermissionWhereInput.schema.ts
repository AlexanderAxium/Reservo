import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { DateTimeFilterObjectSchema } from "./DateTimeFilter.schema";
import { PermissionScalarRelationFilterObjectSchema } from "./PermissionScalarRelationFilter.schema";
import { PermissionWhereInputObjectSchema } from "./PermissionWhereInput.schema";
import { RoleScalarRelationFilterObjectSchema } from "./RoleScalarRelationFilter.schema";
import { RoleWhereInputObjectSchema } from "./RoleWhereInput.schema";
import { StringFilterObjectSchema } from "./StringFilter.schema";

const rolepermissionwhereinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => RolePermissionWhereInputObjectSchema),
        z.lazy(() => RolePermissionWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => RolePermissionWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => RolePermissionWhereInputObjectSchema),
        z.lazy(() => RolePermissionWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    roleId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    permissionId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
    permission: z
      .union([
        z.lazy(() => PermissionScalarRelationFilterObjectSchema),
        z.lazy(() => PermissionWhereInputObjectSchema),
      ])
      .optional(),
    role: z
      .union([
        z.lazy(() => RoleScalarRelationFilterObjectSchema),
        z.lazy(() => RoleWhereInputObjectSchema),
      ])
      .optional(),
  })
  .strict();
export const RolePermissionWhereInputObjectSchema: z.ZodType<Prisma.RolePermissionWhereInput> =
  rolepermissionwhereinputSchema as unknown as z.ZodType<Prisma.RolePermissionWhereInput>;
export const RolePermissionWhereInputObjectZodSchema =
  rolepermissionwhereinputSchema;
