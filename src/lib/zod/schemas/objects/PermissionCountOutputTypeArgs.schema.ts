import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCountOutputTypeSelectObjectSchema } from "./PermissionCountOutputTypeSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z
        .lazy(() => PermissionCountOutputTypeSelectObjectSchema)
        .optional(),
    })
    .strict();
export const PermissionCountOutputTypeArgsObjectSchema = makeSchema();
export const PermissionCountOutputTypeArgsObjectZodSchema = makeSchema();
