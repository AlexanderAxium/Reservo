import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { DateTimeFilterObjectSchema } from "./DateTimeFilter.schema";
import { DateTimeNullableFilterObjectSchema } from "./DateTimeNullableFilter.schema";
import { RoleScalarRelationFilterObjectSchema } from "./RoleScalarRelationFilter.schema";
import { RoleWhereInputObjectSchema } from "./RoleWhereInput.schema";
import { StringFilterObjectSchema } from "./StringFilter.schema";
import { StringNullableFilterObjectSchema } from "./StringNullableFilter.schema";
import { UserScalarRelationFilterObjectSchema } from "./UserScalarRelationFilter.schema";
import { UserWhereInputObjectSchema } from "./UserWhereInput.schema";

const userrolewhereinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => UserRoleWhereInputObjectSchema),
        z.lazy(() => UserRoleWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => UserRoleWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => UserRoleWhereInputObjectSchema),
        z.lazy(() => UserRoleWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    userId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    roleId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    assignedAt: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
    assignedBy: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    expiresAt: z
      .union([
        z.lazy(() => DateTimeNullableFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional()
      .nullable(),
    role: z
      .union([
        z.lazy(() => RoleScalarRelationFilterObjectSchema),
        z.lazy(() => RoleWhereInputObjectSchema),
      ])
      .optional(),
    user: z
      .union([
        z.lazy(() => UserScalarRelationFilterObjectSchema),
        z.lazy(() => UserWhereInputObjectSchema),
      ])
      .optional(),
  })
  .strict();
export const UserRoleWhereInputObjectSchema: z.ZodType<Prisma.UserRoleWhereInput> =
  userrolewhereinputSchema as unknown as z.ZodType<Prisma.UserRoleWhereInput>;
export const UserRoleWhereInputObjectZodSchema = userrolewhereinputSchema;
