import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateNestedManyWithoutRoleInputObjectSchema } from "./RolePermissionCreateNestedManyWithoutRoleInput.schema";
import { TenantCreateNestedOneWithoutRolesInputObjectSchema } from "./TenantCreateNestedOneWithoutRolesInput.schema";
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
      rolePermissions: z.lazy(
        () => RolePermissionCreateNestedManyWithoutRoleInputObjectSchema
      ),
      tenant: z.lazy(() => TenantCreateNestedOneWithoutRolesInputObjectSchema),
      userRoles: z.lazy(
        () => UserRoleCreateNestedManyWithoutRoleInputObjectSchema
      ),
    })
    .strict();
export const RoleCreateInputObjectSchema: z.ZodType<Prisma.RoleCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateInput>;
export const RoleCreateInputObjectZodSchema = makeSchema();
