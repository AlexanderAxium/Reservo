import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateNestedManyWithoutRoleInputObjectSchema } from "./RolePermissionCreateNestedManyWithoutRoleInput.schema";
import { UserRoleCreateNestedManyWithoutRoleInputObjectSchema } from "./UserRoleCreateNestedManyWithoutRoleInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      name: z.string(),
      displayName: z.string(),
      description: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
      isSystem: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      rolePermissions: z
        .lazy(() => RolePermissionCreateNestedManyWithoutRoleInputObjectSchema)
        .optional(),
      userRoles: z
        .lazy(() => UserRoleCreateNestedManyWithoutRoleInputObjectSchema)
        .optional(),
    })
    .strict();
export const RoleCreateWithoutTenantInputObjectSchema: z.ZodType<Prisma.RoleCreateWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateWithoutTenantInput>;
export const RoleCreateWithoutTenantInputObjectZodSchema = makeSchema();
