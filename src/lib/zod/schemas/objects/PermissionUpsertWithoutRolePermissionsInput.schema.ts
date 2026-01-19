import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateWithoutRolePermissionsInputObjectSchema } from "./PermissionCreateWithoutRolePermissionsInput.schema";
import { PermissionUncheckedCreateWithoutRolePermissionsInputObjectSchema } from "./PermissionUncheckedCreateWithoutRolePermissionsInput.schema";
import { PermissionUncheckedUpdateWithoutRolePermissionsInputObjectSchema } from "./PermissionUncheckedUpdateWithoutRolePermissionsInput.schema";
import { PermissionUpdateWithoutRolePermissionsInputObjectSchema } from "./PermissionUpdateWithoutRolePermissionsInput.schema";
import { PermissionWhereInputObjectSchema } from "./PermissionWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      update: z.union([
        z.lazy(() => PermissionUpdateWithoutRolePermissionsInputObjectSchema),
        z.lazy(
          () => PermissionUncheckedUpdateWithoutRolePermissionsInputObjectSchema
        ),
      ]),
      create: z.union([
        z.lazy(() => PermissionCreateWithoutRolePermissionsInputObjectSchema),
        z.lazy(
          () => PermissionUncheckedCreateWithoutRolePermissionsInputObjectSchema
        ),
      ]),
      where: z.lazy(() => PermissionWhereInputObjectSchema).optional(),
    })
    .strict();
export const PermissionUpsertWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.PermissionUpsertWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionUpsertWithoutRolePermissionsInput>;
export const PermissionUpsertWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
