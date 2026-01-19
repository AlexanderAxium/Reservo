import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { DateTimeFilterObjectSchema } from "./DateTimeFilter.schema";
import { StringFilterObjectSchema } from "./StringFilter.schema";

const rolepermissionscalarwhereinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => RolePermissionScalarWhereInputObjectSchema),
        z.lazy(() => RolePermissionScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => RolePermissionScalarWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => RolePermissionScalarWhereInputObjectSchema),
        z.lazy(() => RolePermissionScalarWhereInputObjectSchema).array(),
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
  })
  .strict();
export const RolePermissionScalarWhereInputObjectSchema: z.ZodType<Prisma.RolePermissionScalarWhereInput> =
  rolepermissionscalarwhereinputSchema as unknown as z.ZodType<Prisma.RolePermissionScalarWhereInput>;
export const RolePermissionScalarWhereInputObjectZodSchema =
  rolepermissionscalarwhereinputSchema;
