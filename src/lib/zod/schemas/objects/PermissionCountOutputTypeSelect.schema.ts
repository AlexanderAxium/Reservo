import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCountOutputTypeCountRolePermissionsArgsObjectSchema } from "./PermissionCountOutputTypeCountRolePermissionsArgs.schema";

const makeSchema = () =>
  z
    .object({
      rolePermissions: z
        .union([
          z.boolean(),
          z.lazy(
            () => PermissionCountOutputTypeCountRolePermissionsArgsObjectSchema
          ),
        ])
        .optional(),
    })
    .strict();
export const PermissionCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.PermissionCountOutputTypeSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionCountOutputTypeSelect>;
export const PermissionCountOutputTypeSelectObjectZodSchema = makeSchema();
