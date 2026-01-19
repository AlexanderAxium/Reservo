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
export const RolePermissionCreateManyPermissionInputObjectSchema: z.ZodType<Prisma.RolePermissionCreateManyPermissionInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCreateManyPermissionInput>;
export const RolePermissionCreateManyPermissionInputObjectZodSchema =
  makeSchema();
