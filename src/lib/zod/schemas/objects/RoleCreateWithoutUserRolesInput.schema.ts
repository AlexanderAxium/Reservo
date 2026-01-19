import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionCreateNestedManyWithoutRoleInputObjectSchema } from "./RolePermissionCreateNestedManyWithoutRoleInput.schema";
import { TenantCreateNestedOneWithoutRolesInputObjectSchema } from "./TenantCreateNestedOneWithoutRolesInput.schema";

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
      tenant: z.lazy(() => TenantCreateNestedOneWithoutRolesInputObjectSchema),
    })
    .strict();
export const RoleCreateWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.RoleCreateWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateWithoutUserRolesInput>;
export const RoleCreateWithoutUserRolesInputObjectZodSchema = makeSchema();
