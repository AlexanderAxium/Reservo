import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionFindManySchema } from "../findManyRolePermission.schema";
import { PermissionCountOutputTypeArgsObjectSchema } from "./PermissionCountOutputTypeArgs.schema";
import { TenantArgsObjectSchema } from "./TenantArgs.schema";

const makeSchema = () =>
  z
    .object({
      tenant: z
        .union([z.boolean(), z.lazy(() => TenantArgsObjectSchema)])
        .optional(),
      rolePermissions: z
        .union([z.boolean(), z.lazy(() => RolePermissionFindManySchema)])
        .optional(),
      _count: z
        .union([
          z.boolean(),
          z.lazy(() => PermissionCountOutputTypeArgsObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const PermissionIncludeObjectSchema: z.ZodType<Prisma.PermissionInclude> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionInclude>;
export const PermissionIncludeObjectZodSchema = makeSchema();
