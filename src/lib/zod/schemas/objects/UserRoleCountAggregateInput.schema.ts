import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.literal(true).optional(),
      userId: z.literal(true).optional(),
      roleId: z.literal(true).optional(),
      assignedAt: z.literal(true).optional(),
      assignedBy: z.literal(true).optional(),
      expiresAt: z.literal(true).optional(),
      _all: z.literal(true).optional(),
    })
    .strict();
export const UserRoleCountAggregateInputObjectSchema: z.ZodType<Prisma.UserRoleCountAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleCountAggregateInputType>;
export const UserRoleCountAggregateInputObjectZodSchema = makeSchema();
