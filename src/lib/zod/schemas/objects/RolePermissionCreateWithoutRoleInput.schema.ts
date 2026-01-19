import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateNestedOneWithoutRolePermissionsInputObjectSchema } from "./PermissionCreateNestedOneWithoutRolePermissionsInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      createdAt: z.coerce.date().optional(),
      permission: z.lazy(
        () => PermissionCreateNestedOneWithoutRolePermissionsInputObjectSchema
      ),
    })
    .strict();
export const RolePermissionCreateWithoutRoleInputObjectSchema: z.ZodType<Prisma.RolePermissionCreateWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCreateWithoutRoleInput>;
export const RolePermissionCreateWithoutRoleInputObjectZodSchema = makeSchema();
