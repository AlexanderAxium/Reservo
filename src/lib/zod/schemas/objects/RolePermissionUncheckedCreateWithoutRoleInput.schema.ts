import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      permissionId: z.string(),
      createdAt: z.coerce.date().optional(),
    })
    .strict();
export const RolePermissionUncheckedCreateWithoutRoleInputObjectSchema: z.ZodType<Prisma.RolePermissionUncheckedCreateWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUncheckedCreateWithoutRoleInput>;
export const RolePermissionUncheckedCreateWithoutRoleInputObjectZodSchema =
  makeSchema();
