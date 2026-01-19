import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
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
      updatedAt: z.coerce.date().optional(),
      tenant: z.lazy(() => TenantCreateNestedOneWithoutRolesInputObjectSchema),
      userRoles: z
        .lazy(() => UserRoleCreateNestedManyWithoutRoleInputObjectSchema)
        .optional(),
    })
    .strict();
export const RoleCreateWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.RoleCreateWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateWithoutRolePermissionsInput>;
export const RoleCreateWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
