import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionArgsObjectSchema } from "./PermissionArgs.schema";
import { RoleArgsObjectSchema } from "./RoleArgs.schema";

const makeSchema = () =>
  z
    .object({
      id: z.boolean().optional(),
      roleId: z.boolean().optional(),
      permissionId: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      permission: z
        .union([z.boolean(), z.lazy(() => PermissionArgsObjectSchema)])
        .optional(),
      role: z
        .union([z.boolean(), z.lazy(() => RoleArgsObjectSchema)])
        .optional(),
    })
    .strict();
export const RolePermissionSelectObjectSchema: z.ZodType<Prisma.RolePermissionSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionSelect>;
export const RolePermissionSelectObjectZodSchema = makeSchema();
