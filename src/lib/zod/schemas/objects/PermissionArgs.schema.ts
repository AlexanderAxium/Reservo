import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionIncludeObjectSchema } from "./PermissionInclude.schema";
import { PermissionSelectObjectSchema } from "./PermissionSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z.lazy(() => PermissionSelectObjectSchema).optional(),
      include: z.lazy(() => PermissionIncludeObjectSchema).optional(),
    })
    .strict();
export const PermissionArgsObjectSchema = makeSchema();
export const PermissionArgsObjectZodSchema = makeSchema();
