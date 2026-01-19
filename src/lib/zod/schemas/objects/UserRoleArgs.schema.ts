import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleIncludeObjectSchema } from "./UserRoleInclude.schema";
import { UserRoleSelectObjectSchema } from "./UserRoleSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z.lazy(() => UserRoleSelectObjectSchema).optional(),
      include: z.lazy(() => UserRoleIncludeObjectSchema).optional(),
    })
    .strict();
export const UserRoleArgsObjectSchema = makeSchema();
export const UserRoleArgsObjectZodSchema = makeSchema();
