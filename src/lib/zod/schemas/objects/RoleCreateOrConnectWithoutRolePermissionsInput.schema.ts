import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateWithoutRolePermissionsInputObjectSchema } from "./RoleCreateWithoutRolePermissionsInput.schema";
import { RoleUncheckedCreateWithoutRolePermissionsInputObjectSchema } from "./RoleUncheckedCreateWithoutRolePermissionsInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./RoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RoleWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => RoleCreateWithoutRolePermissionsInputObjectSchema),
        z.lazy(
          () => RoleUncheckedCreateWithoutRolePermissionsInputObjectSchema
        ),
      ]),
    })
    .strict();
export const RoleCreateOrConnectWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateOrConnectWithoutRolePermissionsInput>;
export const RoleCreateOrConnectWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
