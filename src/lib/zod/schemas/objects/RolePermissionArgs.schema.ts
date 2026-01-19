import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionIncludeObjectSchema } from "./RolePermissionInclude.schema";
import { RolePermissionSelectObjectSchema } from "./RolePermissionSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z.lazy(() => RolePermissionSelectObjectSchema).optional(),
      include: z.lazy(() => RolePermissionIncludeObjectSchema).optional(),
    })
    .strict();
export const RolePermissionArgsObjectSchema = makeSchema();
export const RolePermissionArgsObjectZodSchema = makeSchema();
