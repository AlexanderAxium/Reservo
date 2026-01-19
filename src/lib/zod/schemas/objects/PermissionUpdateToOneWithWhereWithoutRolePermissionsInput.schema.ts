import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionUncheckedUpdateWithoutRolePermissionsInputObjectSchema } from "./PermissionUncheckedUpdateWithoutRolePermissionsInput.schema";
import { PermissionUpdateWithoutRolePermissionsInputObjectSchema } from "./PermissionUpdateWithoutRolePermissionsInput.schema";
import { PermissionWhereInputObjectSchema } from "./PermissionWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => PermissionWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => PermissionUpdateWithoutRolePermissionsInputObjectSchema),
        z.lazy(
          () => PermissionUncheckedUpdateWithoutRolePermissionsInputObjectSchema
        ),
      ]),
    })
    .strict();
export const PermissionUpdateToOneWithWhereWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.PermissionUpdateToOneWithWhereWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionUpdateToOneWithWhereWithoutRolePermissionsInput>;
export const PermissionUpdateToOneWithWhereWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
