import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateNestedOneWithoutRolePermissionsInputObjectSchema } from "./RoleCreateNestedOneWithoutRolePermissionsInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      createdAt: z.coerce.date().optional(),
      role: z.lazy(
        () => RoleCreateNestedOneWithoutRolePermissionsInputObjectSchema
      ),
    })
    .strict();
export const RolePermissionCreateWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RolePermissionCreateWithoutPermissionInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCreateWithoutPermissionInput>;
export const RolePermissionCreateWithoutPermissionInputObjectZodSchema =
  makeSchema();
