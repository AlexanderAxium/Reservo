import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      roleId: z.string(),
      createdAt: z.coerce.date().optional(),
    })
    .strict();
export const RolePermissionUncheckedCreateWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RolePermissionUncheckedCreateWithoutPermissionInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUncheckedCreateWithoutPermissionInput>;
export const RolePermissionUncheckedCreateWithoutPermissionInputObjectZodSchema =
  makeSchema();
