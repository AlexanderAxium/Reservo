import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCountOutputTypeCountRolePermissionsArgsObjectSchema } from "./RoleCountOutputTypeCountRolePermissionsArgs.schema";
import { RoleCountOutputTypeCountUserRolesArgsObjectSchema } from "./RoleCountOutputTypeCountUserRolesArgs.schema";

const makeSchema = () =>
  z
    .object({
      rolePermissions: z
        .union([
          z.boolean(),
          z.lazy(() => RoleCountOutputTypeCountRolePermissionsArgsObjectSchema),
        ])
        .optional(),
      userRoles: z
        .union([
          z.boolean(),
          z.lazy(() => RoleCountOutputTypeCountUserRolesArgsObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const RoleCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.RoleCountOutputTypeSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCountOutputTypeSelect>;
export const RoleCountOutputTypeSelectObjectZodSchema = makeSchema();
