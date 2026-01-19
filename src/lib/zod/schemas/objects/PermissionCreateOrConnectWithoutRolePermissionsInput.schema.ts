import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateWithoutRolePermissionsInputObjectSchema } from "./PermissionCreateWithoutRolePermissionsInput.schema";
import { PermissionUncheckedCreateWithoutRolePermissionsInputObjectSchema } from "./PermissionUncheckedCreateWithoutRolePermissionsInput.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./PermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => PermissionWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => PermissionCreateWithoutRolePermissionsInputObjectSchema),
        z.lazy(
          () => PermissionUncheckedCreateWithoutRolePermissionsInputObjectSchema
        ),
      ]),
    })
    .strict();
export const PermissionCreateOrConnectWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.PermissionCreateOrConnectWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateOrConnectWithoutRolePermissionsInput>;
export const PermissionCreateOrConnectWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
