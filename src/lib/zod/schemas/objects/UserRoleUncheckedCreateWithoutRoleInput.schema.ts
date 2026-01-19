import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      userId: z.string(),
      assignedAt: z.coerce.date().optional(),
      assignedBy: z.string().optional().nullable(),
      expiresAt: z.coerce.date().optional().nullable(),
    })
    .strict();
export const UserRoleUncheckedCreateWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserRoleUncheckedCreateWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUncheckedCreateWithoutRoleInput>;
export const UserRoleUncheckedCreateWithoutRoleInputObjectZodSchema =
  makeSchema();
