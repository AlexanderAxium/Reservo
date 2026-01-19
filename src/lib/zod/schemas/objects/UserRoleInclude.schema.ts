import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleArgsObjectSchema } from "./RoleArgs.schema";
import { UserArgsObjectSchema } from "./UserArgs.schema";

const makeSchema = () =>
  z
    .object({
      role: z
        .union([z.boolean(), z.lazy(() => RoleArgsObjectSchema)])
        .optional(),
      user: z
        .union([z.boolean(), z.lazy(() => UserArgsObjectSchema)])
        .optional(),
    })
    .strict();
export const UserRoleIncludeObjectSchema: z.ZodType<Prisma.UserRoleInclude> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleInclude>;
export const UserRoleIncludeObjectZodSchema = makeSchema();
