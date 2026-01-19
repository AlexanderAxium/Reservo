import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      roleId: z.string(),
      assignedAt: z.coerce.date().optional(),
      assignedBy: z.string().optional().nullable(),
      expiresAt: z.coerce.date().optional().nullable(),
    })
    .strict();
export const UserRoleUncheckedCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.UserRoleUncheckedCreateWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUncheckedCreateWithoutUserInput>;
export const UserRoleUncheckedCreateWithoutUserInputObjectZodSchema =
  makeSchema();
