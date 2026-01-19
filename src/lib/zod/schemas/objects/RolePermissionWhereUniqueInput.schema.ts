import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionRoleIdPermissionIdCompoundUniqueInputObjectSchema } from "./RolePermissionRoleIdPermissionIdCompoundUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      roleId_permissionId: z
        .lazy(
          () => RolePermissionRoleIdPermissionIdCompoundUniqueInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const RolePermissionWhereUniqueInputObjectSchema: z.ZodType<Prisma.RolePermissionWhereUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionWhereUniqueInput>;
export const RolePermissionWhereUniqueInputObjectZodSchema = makeSchema();
