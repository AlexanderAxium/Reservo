import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateNestedOneWithoutRolePermissionsInputObjectSchema } from "./PermissionCreateNestedOneWithoutRolePermissionsInput.schema";
import { RoleCreateNestedOneWithoutRolePermissionsInputObjectSchema } from "./RoleCreateNestedOneWithoutRolePermissionsInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      createdAt: z.coerce.date().optional(),
      permission: z.lazy(
        () => PermissionCreateNestedOneWithoutRolePermissionsInputObjectSchema
      ),
      role: z.lazy(
        () => RoleCreateNestedOneWithoutRolePermissionsInputObjectSchema
      ),
    })
    .strict();
export const RolePermissionCreateInputObjectSchema: z.ZodType<Prisma.RolePermissionCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCreateInput>;
export const RolePermissionCreateInputObjectZodSchema = makeSchema();
