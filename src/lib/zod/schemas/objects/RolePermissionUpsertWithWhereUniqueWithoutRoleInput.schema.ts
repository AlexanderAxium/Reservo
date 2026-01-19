import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateWithoutRoleInputObjectSchema } from "./RolePermissionCreateWithoutRoleInput.schema";
import { RolePermissionUncheckedCreateWithoutRoleInputObjectSchema } from "./RolePermissionUncheckedCreateWithoutRoleInput.schema";
import { RolePermissionUncheckedUpdateWithoutRoleInputObjectSchema } from "./RolePermissionUncheckedUpdateWithoutRoleInput.schema";
import { RolePermissionUpdateWithoutRoleInputObjectSchema } from "./RolePermissionUpdateWithoutRoleInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./RolePermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => RolePermissionUpdateWithoutRoleInputObjectSchema),
        z.lazy(() => RolePermissionUncheckedUpdateWithoutRoleInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => RolePermissionCreateWithoutRoleInputObjectSchema),
        z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputObjectSchema),
      ]),
    })
    .strict();
export const RolePermissionUpsertWithWhereUniqueWithoutRoleInputObjectSchema: z.ZodType<Prisma.RolePermissionUpsertWithWhereUniqueWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpsertWithWhereUniqueWithoutRoleInput>;
export const RolePermissionUpsertWithWhereUniqueWithoutRoleInputObjectZodSchema =
  makeSchema();
