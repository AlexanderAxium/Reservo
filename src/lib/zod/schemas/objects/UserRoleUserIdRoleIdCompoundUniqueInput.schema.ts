import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      userId: z.string(),
      roleId: z.string(),
    })
    .strict();
export const UserRoleUserIdRoleIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.UserRoleUserIdRoleIdCompoundUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUserIdRoleIdCompoundUniqueInput>;
export const UserRoleUserIdRoleIdCompoundUniqueInputObjectZodSchema =
  makeSchema();
