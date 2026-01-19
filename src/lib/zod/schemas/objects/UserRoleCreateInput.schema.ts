import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateNestedOneWithoutUserRolesInputObjectSchema } from "./RoleCreateNestedOneWithoutUserRolesInput.schema";
import { UserCreateNestedOneWithoutUserRolesInputObjectSchema } from "./UserCreateNestedOneWithoutUserRolesInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      assignedAt: z.coerce.date().optional(),
      assignedBy: z.string().optional().nullable(),
      expiresAt: z.coerce.date().optional().nullable(),
      role: z.lazy(() => RoleCreateNestedOneWithoutUserRolesInputObjectSchema),
      user: z.lazy(() => UserCreateNestedOneWithoutUserRolesInputObjectSchema),
    })
    .strict();
export const UserRoleCreateInputObjectSchema: z.ZodType<Prisma.UserRoleCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleCreateInput>;
export const UserRoleCreateInputObjectZodSchema = makeSchema();
