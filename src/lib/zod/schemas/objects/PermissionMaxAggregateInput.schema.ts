import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.literal(true).optional(),
      action: z.literal(true).optional(),
      resource: z.literal(true).optional(),
      description: z.literal(true).optional(),
      isActive: z.literal(true).optional(),
      createdAt: z.literal(true).optional(),
      updatedAt: z.literal(true).optional(),
      tenantId: z.literal(true).optional(),
    })
    .strict();
export const PermissionMaxAggregateInputObjectSchema: z.ZodType<Prisma.PermissionMaxAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionMaxAggregateInputType>;
export const PermissionMaxAggregateInputObjectZodSchema = makeSchema();
