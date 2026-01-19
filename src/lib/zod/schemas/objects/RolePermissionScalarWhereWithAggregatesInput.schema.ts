import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { DateTimeWithAggregatesFilterObjectSchema } from "./DateTimeWithAggregatesFilter.schema";
import { StringWithAggregatesFilterObjectSchema } from "./StringWithAggregatesFilter.schema";

const rolepermissionscalarwherewithaggregatesinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => RolePermissionScalarWhereWithAggregatesInputObjectSchema),
        z
          .lazy(() => RolePermissionScalarWhereWithAggregatesInputObjectSchema)
          .array(),
      ])
      .optional(),
    OR: z
      .lazy(() => RolePermissionScalarWhereWithAggregatesInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => RolePermissionScalarWhereWithAggregatesInputObjectSchema),
        z
          .lazy(() => RolePermissionScalarWhereWithAggregatesInputObjectSchema)
          .array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    roleId: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    permissionId: z
      .union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()])
      .optional(),
    createdAt: z
      .union([
        z.lazy(() => DateTimeWithAggregatesFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional(),
  })
  .strict();
export const RolePermissionScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.RolePermissionScalarWhereWithAggregatesInput> =
  rolepermissionscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.RolePermissionScalarWhereWithAggregatesInput>;
export const RolePermissionScalarWhereWithAggregatesInputObjectZodSchema =
  rolepermissionscalarwherewithaggregatesinputSchema;
