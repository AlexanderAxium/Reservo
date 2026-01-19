import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema } from "./RolePermissionUncheckedCreateNestedManyWithoutRoleInput.schema";

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
      tenantId: z.string(),
      rolePermissions: z
        .lazy(
          () =>
            RolePermissionUncheckedCreateNestedManyWithoutRoleInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const RoleUncheckedCreateWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateWithoutUserRolesInput>;
export const RoleUncheckedCreateWithoutUserRolesInputObjectZodSchema =
  makeSchema();
