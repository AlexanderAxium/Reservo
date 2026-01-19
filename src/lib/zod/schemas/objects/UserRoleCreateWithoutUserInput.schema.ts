import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateNestedOneWithoutUserRolesInputObjectSchema } from "./RoleCreateNestedOneWithoutUserRolesInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      assignedAt: z.coerce.date().optional(),
      assignedBy: z.string().optional().nullable(),
      expiresAt: z.coerce.date().optional().nullable(),
      role: z.lazy(() => RoleCreateNestedOneWithoutUserRolesInputObjectSchema),
    })
    .strict();
export const UserRoleCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.UserRoleCreateWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleCreateWithoutUserInput>;
export const UserRoleCreateWithoutUserInputObjectZodSchema = makeSchema();
