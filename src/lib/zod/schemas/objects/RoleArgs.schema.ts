import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleIncludeObjectSchema } from "./RoleInclude.schema";
import { RoleSelectObjectSchema } from "./RoleSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z.lazy(() => RoleSelectObjectSchema).optional(),
      include: z.lazy(() => RoleIncludeObjectSchema).optional(),
    })
    .strict();
export const RoleArgsObjectSchema = makeSchema();
export const RoleArgsObjectZodSchema = makeSchema();
