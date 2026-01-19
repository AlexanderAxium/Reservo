import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleUncheckedUpdateWithoutRolePermissionsInputObjectSchema } from "./RoleUncheckedUpdateWithoutRolePermissionsInput.schema";
import { RoleUpdateWithoutRolePermissionsInputObjectSchema } from "./RoleUpdateWithoutRolePermissionsInput.schema";
import { RoleWhereInputObjectSchema } from "./RoleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RoleWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => RoleUpdateWithoutRolePermissionsInputObjectSchema),
        z.lazy(
          () => RoleUncheckedUpdateWithoutRolePermissionsInputObjectSchema
        ),
      ]),
    })
    .strict();
export const RoleUpdateToOneWithWhereWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.RoleUpdateToOneWithWhereWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateToOneWithWhereWithoutRolePermissionsInput>;
export const RoleUpdateToOneWithWhereWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
