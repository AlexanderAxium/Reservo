import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleArgsObjectSchema } from "./RoleArgs.schema";
import { UserArgsObjectSchema } from "./UserArgs.schema";

const makeSchema = () =>
  z
    .object({
      id: z.boolean().optional(),
      userId: z.boolean().optional(),
      roleId: z.boolean().optional(),
      assignedAt: z.boolean().optional(),
      assignedBy: z.boolean().optional(),
      expiresAt: z.boolean().optional(),
      role: z
        .union([z.boolean(), z.lazy(() => RoleArgsObjectSchema)])
        .optional(),
      user: z
        .union([z.boolean(), z.lazy(() => UserArgsObjectSchema)])
        .optional(),
    })
    .strict();
export const UserRoleSelectObjectSchema: z.ZodType<Prisma.UserRoleSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleSelect>;
export const UserRoleSelectObjectZodSchema = makeSchema();
