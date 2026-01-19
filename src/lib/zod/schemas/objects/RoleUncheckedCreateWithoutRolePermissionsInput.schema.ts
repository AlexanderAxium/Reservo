import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
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
      tenantId: z.string(),
      userRoles: z
        .lazy(
          () => UserRoleUncheckedCreateNestedManyWithoutRoleInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const RoleUncheckedCreateWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUncheckedCreateWithoutRolePermissionsInput>;
export const RoleUncheckedCreateWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
