import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema } from "./RolePermissionUncheckedCreateNestedManyWithoutRoleInput.schema";
import { UserRoleUncheckedCreateNestedManyWithoutRoleInputObjectSchema } from "./UserRoleUncheckedCreateNestedManyWithoutRoleInput.schema";

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
        .lazy(
          () =>
            RolePermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema
        )
        .optional(),
      userRoles: z
        .lazy(
          () => UserRoleUncheckedCreateNestedManyWithoutRoleInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const RoleUncheckedCreateWithoutTenantInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateWithoutTenantInput>;
export const RoleUncheckedCreateWithoutTenantInputObjectZodSchema =
  makeSchema();
