import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionFindManySchema } from "../findManyRolePermission.schema";
import { PermissionCountOutputTypeArgsObjectSchema } from "./PermissionCountOutputTypeArgs.schema";
import { TenantArgsObjectSchema } from "./TenantArgs.schema";

const makeSchema = () =>
  z
    .object({
      id: z.boolean().optional(),
      action: z.boolean().optional(),
      resource: z.boolean().optional(),
      description: z.boolean().optional(),
      isActive: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      updatedAt: z.boolean().optional(),
      tenantId: z.boolean().optional(),
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
export const PermissionSelectObjectSchema: z.ZodType<Prisma.PermissionSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionSelect>;
export const PermissionSelectObjectZodSchema = makeSchema();
