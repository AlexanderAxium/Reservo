import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserIncludeObjectSchema } from "./UserInclude.schema";
import { UserSelectObjectSchema } from "./UserSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z.lazy(() => UserSelectObjectSchema).optional(),
      include: z.lazy(() => UserIncludeObjectSchema).optional(),
    })
    .strict();
export const UserArgsObjectSchema = makeSchema();
export const UserArgsObjectZodSchema = makeSchema();
