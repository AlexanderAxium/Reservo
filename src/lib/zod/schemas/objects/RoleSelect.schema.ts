import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionFindManySchema } from "../findManyRolePermission.schema";
import { UserRoleFindManySchema } from "../findManyUserRole.schema";
import { RoleCountOutputTypeArgsObjectSchema } from "./RoleCountOutputTypeArgs.schema";
import { TenantArgsObjectSchema } from "./TenantArgs.schema";

const makeSchema = () =>
  z
    .object({
      id: z.boolean().optional(),
      name: z.boolean().optional(),
      displayName: z.boolean().optional(),
      description: z.boolean().optional(),
      isActive: z.boolean().optional(),
      isSystem: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      updatedAt: z.boolean().optional(),
      tenantId: z.boolean().optional(),
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
export const RoleSelectObjectSchema: z.ZodType<Prisma.RoleSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleSelect>;
export const RoleSelectObjectZodSchema = makeSchema();
