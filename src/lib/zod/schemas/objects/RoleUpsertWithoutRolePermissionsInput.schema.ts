import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateWithoutRolePermissionsInputObjectSchema } from "./RoleCreateWithoutRolePermissionsInput.schema";
import { RoleUncheckedCreateWithoutRolePermissionsInputObjectSchema } from "./RoleUncheckedCreateWithoutRolePermissionsInput.schema";
import { RoleUncheckedUpdateWithoutRolePermissionsInputObjectSchema } from "./RoleUncheckedUpdateWithoutRolePermissionsInput.schema";
import { RoleUpdateWithoutRolePermissionsInputObjectSchema } from "./RoleUpdateWithoutRolePermissionsInput.schema";
import { RoleWhereInputObjectSchema } from "./RoleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      update: z.union([
        z.lazy(() => RoleUpdateWithoutRolePermissionsInputObjectSchema),
        z.lazy(
          () => RoleUncheckedUpdateWithoutRolePermissionsInputObjectSchema
        ),
      ]),
      create: z.union([
        z.lazy(() => RoleCreateWithoutRolePermissionsInputObjectSchema),
        z.lazy(
          () => RoleUncheckedCreateWithoutRolePermissionsInputObjectSchema
        ),
      ]),
      where: z.lazy(() => RoleWhereInputObjectSchema).optional(),
    })
    .strict();
export const RoleUpsertWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.RoleUpsertWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUpsertWithoutRolePermissionsInput>;
export const RoleUpsertWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
