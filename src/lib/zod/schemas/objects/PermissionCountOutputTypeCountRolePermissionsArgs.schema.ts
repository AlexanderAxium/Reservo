import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionWhereInputObjectSchema } from "./RolePermissionWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => RolePermissionWhereInputObjectSchema).optional(),
    })
    .strict();
export const PermissionCountOutputTypeCountRolePermissionsArgsObjectSchema =
  makeSchema();
export const PermissionCountOutputTypeCountRolePermissionsArgsObjectZodSchema =
  makeSchema();
