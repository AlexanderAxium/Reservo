import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionArgsObjectSchema } from "./PermissionArgs.schema";
import { RoleArgsObjectSchema } from "./RoleArgs.schema";

const makeSchema = () =>
  z
    .object({
      permission: z
        .union([z.boolean(), z.lazy(() => PermissionArgsObjectSchema)])
        .optional(),
      role: z
        .union([z.boolean(), z.lazy(() => RoleArgsObjectSchema)])
        .optional(),
    })
    .strict();
export const RolePermissionIncludeObjectSchema: z.ZodType<Prisma.RolePermissionInclude> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionInclude>;
export const RolePermissionIncludeObjectZodSchema = makeSchema();
