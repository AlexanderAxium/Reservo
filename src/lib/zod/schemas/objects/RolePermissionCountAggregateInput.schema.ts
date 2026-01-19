import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.literal(true).optional(),
      roleId: z.literal(true).optional(),
      permissionId: z.literal(true).optional(),
      createdAt: z.literal(true).optional(),
      _all: z.literal(true).optional(),
    })
    .strict();
export const RolePermissionCountAggregateInputObjectSchema: z.ZodType<Prisma.RolePermissionCountAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionCountAggregateInputType>;
export const RolePermissionCountAggregateInputObjectZodSchema = makeSchema();
