import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateOrConnectWithoutRolePermissionsInputObjectSchema } from "./RoleCreateOrConnectWithoutRolePermissionsInput.schema";
import { RoleCreateWithoutRolePermissionsInputObjectSchema } from "./RoleCreateWithoutRolePermissionsInput.schema";
import { RoleUncheckedCreateWithoutRolePermissionsInputObjectSchema } from "./RoleUncheckedCreateWithoutRolePermissionsInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./RoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => RoleCreateWithoutRolePermissionsInputObjectSchema),
          z.lazy(
            () => RoleUncheckedCreateWithoutRolePermissionsInputObjectSchema
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => RoleCreateOrConnectWithoutRolePermissionsInputObjectSchema)
        .optional(),
      connect: z.lazy(() => RoleWhereUniqueInputObjectSchema).optional(),
    })
    .strict();
export const RoleCreateNestedOneWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.RoleCreateNestedOneWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateNestedOneWithoutRolePermissionsInput>;
export const RoleCreateNestedOneWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
