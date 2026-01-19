import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleUserIdRoleIdCompoundUniqueInputObjectSchema } from "./UserRoleUserIdRoleIdCompoundUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      userId_roleId: z
        .lazy(() => UserRoleUserIdRoleIdCompoundUniqueInputObjectSchema)
        .optional(),
    })
    .strict();
export const UserRoleWhereUniqueInputObjectSchema: z.ZodType<Prisma.UserRoleWhereUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleWhereUniqueInput>;
export const UserRoleWhereUniqueInputObjectZodSchema = makeSchema();
