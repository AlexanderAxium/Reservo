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
      tenantId: z.string(),
      rolePermissions: z.lazy(
        () =>
          RolePermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema
      ),
      userRoles: z.lazy(
        () => UserRoleUncheckedCreateNestedManyWithoutRoleInputObjectSchema
      ),
    })
    .strict();
export const RoleUncheckedCreateInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateInput>;
export const RoleUncheckedCreateInputObjectZodSchema = makeSchema();
