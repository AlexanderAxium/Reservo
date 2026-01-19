import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateNestedOneWithoutUserRolesInputObjectSchema } from "./UserCreateNestedOneWithoutUserRolesInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      assignedAt: z.coerce.date().optional(),
      assignedBy: z.string().optional().nullable(),
      expiresAt: z.coerce.date().optional().nullable(),
      user: z.lazy(() => UserCreateNestedOneWithoutUserRolesInputObjectSchema),
    })
    .strict();
export const UserRoleCreateWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserRoleCreateWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleCreateWithoutRoleInput>;
export const UserRoleCreateWithoutRoleInputObjectZodSchema = makeSchema();
