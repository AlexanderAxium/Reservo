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
export const RolePermissionCreateManyInputObjectSchema: z.ZodType<Prisma.RolePermissionCreateManyInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCreateManyInput>;
export const RolePermissionCreateManyInputObjectZodSchema = makeSchema();
