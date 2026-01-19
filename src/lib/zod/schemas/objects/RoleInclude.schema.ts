import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionFindManySchema } from "../findManyRolePermission.schema";
import { UserRoleFindManySchema } from "../findManyUserRole.schema";
import { RoleCountOutputTypeArgsObjectSchema } from "./RoleCountOutputTypeArgs.schema";
import { TenantArgsObjectSchema } from "./TenantArgs.schema";

const makeSchema = () =>
  z
    .object({
      rolePermissions: z
        .union([z.boolean(), z.lazy(() => RolePermissionFindManySchema)])
        .optional(),
      tenant: z
        .union([z.boolean(), z.lazy(() => TenantArgsObjectSchema)])
        .optional(),
      userRoles: z
        .union([z.boolean(), z.lazy(() => UserRoleFindManySchema)])
        .optional(),
      _count: z
        .union([z.boolean(), z.lazy(() => RoleCountOutputTypeArgsObjectSchema)])
        .optional(),
    })
    .strict();
export const RoleIncludeObjectSchema: z.ZodType<Prisma.RoleInclude> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleInclude>;
export const RoleIncludeObjectZodSchema = makeSchema();
