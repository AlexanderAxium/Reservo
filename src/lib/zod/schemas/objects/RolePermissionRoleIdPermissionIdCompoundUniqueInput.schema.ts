import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      roleId: z.string(),
      permissionId: z.string(),
    })
    .strict();
export const RolePermissionRoleIdPermissionIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.RolePermissionRoleIdPermissionIdCompoundUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionRoleIdPermissionIdCompoundUniqueInput>;
export const RolePermissionRoleIdPermissionIdCompoundUniqueInputObjectZodSchema =
  makeSchema();
