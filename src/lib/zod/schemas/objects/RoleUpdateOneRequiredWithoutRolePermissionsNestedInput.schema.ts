import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateOrConnectWithoutRolePermissionsInputObjectSchema } from "./RoleCreateOrConnectWithoutRolePermissionsInput.schema";
import { RoleCreateWithoutRolePermissionsInputObjectSchema } from "./RoleCreateWithoutRolePermissionsInput.schema";
import { RoleUncheckedCreateWithoutRolePermissionsInputObjectSchema } from "./RoleUncheckedCreateWithoutRolePermissionsInput.schema";
import { RoleUncheckedUpdateWithoutRolePermissionsInputObjectSchema } from "./RoleUncheckedUpdateWithoutRolePermissionsInput.schema";
import { RoleUpdateToOneWithWhereWithoutRolePermissionsInputObjectSchema } from "./RoleUpdateToOneWithWhereWithoutRolePermissionsInput.schema";
import { RoleUpdateWithoutRolePermissionsInputObjectSchema } from "./RoleUpdateWithoutRolePermissionsInput.schema";
import { RoleUpsertWithoutRolePermissionsInputObjectSchema } from "./RoleUpsertWithoutRolePermissionsInput.schema";
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
      upsert: z
        .lazy(() => RoleUpsertWithoutRolePermissionsInputObjectSchema)
        .optional(),
      connect: z.lazy(() => RoleWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(
            () =>
              RoleUpdateToOneWithWhereWithoutRolePermissionsInputObjectSchema
          ),
          z.lazy(() => RoleUpdateWithoutRolePermissionsInputObjectSchema),
          z.lazy(
            () => RoleUncheckedUpdateWithoutRolePermissionsInputObjectSchema
          ),
        ])
        .optional(),
    })
    .strict();
export const RoleUpdateOneRequiredWithoutRolePermissionsNestedInputObjectSchema: z.ZodType<Prisma.RoleUpdateOneRequiredWithoutRolePermissionsNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateOneRequiredWithoutRolePermissionsNestedInput>;
export const RoleUpdateOneRequiredWithoutRolePermissionsNestedInputObjectZodSchema =
  makeSchema();
