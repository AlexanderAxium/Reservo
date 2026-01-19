import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateOrConnectWithoutRolePermissionsInputObjectSchema } from "./PermissionCreateOrConnectWithoutRolePermissionsInput.schema";
import { PermissionCreateWithoutRolePermissionsInputObjectSchema } from "./PermissionCreateWithoutRolePermissionsInput.schema";
import { PermissionUncheckedCreateWithoutRolePermissionsInputObjectSchema } from "./PermissionUncheckedCreateWithoutRolePermissionsInput.schema";
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
      connect: z.lazy(() => PermissionWhereUniqueInputObjectSchema).optional(),
    })
    .strict();
export const PermissionCreateNestedOneWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.PermissionCreateNestedOneWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateNestedOneWithoutRolePermissionsInput>;
export const PermissionCreateNestedOneWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
