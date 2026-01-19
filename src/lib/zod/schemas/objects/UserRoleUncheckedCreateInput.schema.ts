import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string(),
      roleId: z.string(),
      assignedAt: z.coerce.date().optional(),
      assignedBy: z.string().optional().nullable(),
      expiresAt: z.coerce.date().optional().nullable(),
    })
    .strict();
export const UserRoleUncheckedCreateInputObjectSchema: z.ZodType<Prisma.UserRoleUncheckedCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUncheckedCreateInput>;
export const UserRoleUncheckedCreateInputObjectZodSchema = makeSchema();
