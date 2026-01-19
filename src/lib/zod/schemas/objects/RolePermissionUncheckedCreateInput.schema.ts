import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      roleId: z.string(),
      permissionId: z.string(),
      createdAt: z.coerce.date().optional(),
    })
    .strict();
export const RolePermissionUncheckedCreateInputObjectSchema: z.ZodType<Prisma.RolePermissionUncheckedCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUncheckedCreateInput>;
export const RolePermissionUncheckedCreateInputObjectZodSchema = makeSchema();
