import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateOrConnectWithoutRolePermissionsInputObjectSchema } from "./PermissionCreateOrConnectWithoutRolePermissionsInput.schema";
import { PermissionCreateWithoutRolePermissionsInputObjectSchema } from "./PermissionCreateWithoutRolePermissionsInput.schema";
import { PermissionUncheckedCreateWithoutRolePermissionsInputObjectSchema } from "./PermissionUncheckedCreateWithoutRolePermissionsInput.schema";
import { PermissionUncheckedUpdateWithoutRolePermissionsInputObjectSchema } from "./PermissionUncheckedUpdateWithoutRolePermissionsInput.schema";
import { PermissionUpdateToOneWithWhereWithoutRolePermissionsInputObjectSchema } from "./PermissionUpdateToOneWithWhereWithoutRolePermissionsInput.schema";
import { PermissionUpdateWithoutRolePermissionsInputObjectSchema } from "./PermissionUpdateWithoutRolePermissionsInput.schema";
import { PermissionUpsertWithoutRolePermissionsInputObjectSchema } from "./PermissionUpsertWithoutRolePermissionsInput.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./PermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => PermissionCreateWithoutRolePermissionsInputObjectSchema),
          z.lazy(
            () =>
              PermissionUncheckedCreateWithoutRolePermissionsInputObjectSchema
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(
          () => PermissionCreateOrConnectWithoutRolePermissionsInputObjectSchema
        )
        .optional(),
      upsert: z
        .lazy(() => PermissionUpsertWithoutRolePermissionsInputObjectSchema)
        .optional(),
      connect: z.lazy(() => PermissionWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(
            () =>
              PermissionUpdateToOneWithWhereWithoutRolePermissionsInputObjectSchema
          ),
          z.lazy(() => PermissionUpdateWithoutRolePermissionsInputObjectSchema),
          z.lazy(
            () =>
              PermissionUncheckedUpdateWithoutRolePermissionsInputObjectSchema
          ),
        ])
        .optional(),
    })
    .strict();
export const PermissionUpdateOneRequiredWithoutRolePermissionsNestedInputObjectSchema: z.ZodType<Prisma.PermissionUpdateOneRequiredWithoutRolePermissionsNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionUpdateOneRequiredWithoutRolePermissionsNestedInput>;
export const PermissionUpdateOneRequiredWithoutRolePermissionsNestedInputObjectZodSchema =
  makeSchema();
