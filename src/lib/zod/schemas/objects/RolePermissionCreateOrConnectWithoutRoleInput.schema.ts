import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateWithoutRoleInputObjectSchema } from "./RolePermissionCreateWithoutRoleInput.schema";
import { RolePermissionUncheckedCreateWithoutRoleInputObjectSchema } from "./RolePermissionUncheckedCreateWithoutRoleInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./RolePermissionWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RolePermissionWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => RolePermissionCreateWithoutRoleInputObjectSchema),
        z.lazy(() => RolePermissionUncheckedCreateWithoutRoleInputObjectSchema),
      ]),
    })
    .strict();
export const RolePermissionCreateOrConnectWithoutRoleInputObjectSchema: z.ZodType<Prisma.RolePermissionCreateOrConnectWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCreateOrConnectWithoutRoleInput>;
export const RolePermissionCreateOrConnectWithoutRoleInputObjectZodSchema =
  makeSchema();
