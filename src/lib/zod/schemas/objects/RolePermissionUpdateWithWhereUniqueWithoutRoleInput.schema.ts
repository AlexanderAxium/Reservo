import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionUncheckedUpdateWithoutRoleInputObjectSchema } from "./RolePermissionUncheckedUpdateWithoutRoleInput.schema";
import { RolePermissionUpdateWithoutRoleInputObjectSchema } from "./RolePermissionUpdateWithoutRoleInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./RolePermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => RolePermissionUpdateWithoutRoleInputObjectSchema),
        z.lazy(() => RolePermissionUncheckedUpdateWithoutRoleInputObjectSchema),
      ]),
    })
    .strict();
export const RolePermissionUpdateWithWhereUniqueWithoutRoleInputObjectSchema: z.ZodType<Prisma.RolePermissionUpdateWithWhereUniqueWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpdateWithWhereUniqueWithoutRoleInput>;
export const RolePermissionUpdateWithWhereUniqueWithoutRoleInputObjectZodSchema =
  makeSchema();
