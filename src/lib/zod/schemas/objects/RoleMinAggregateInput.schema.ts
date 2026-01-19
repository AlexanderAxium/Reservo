import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.literal(true).optional(),
      name: z.literal(true).optional(),
      displayName: z.literal(true).optional(),
      description: z.literal(true).optional(),
      isActive: z.literal(true).optional(),
      isSystem: z.literal(true).optional(),
      createdAt: z.literal(true).optional(),
      updatedAt: z.literal(true).optional(),
      tenantId: z.literal(true).optional(),
    })
    .strict();
export const RoleMinAggregateInputObjectSchema: z.ZodType<Prisma.RoleMinAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleMinAggregateInputType>;
export const RoleMinAggregateInputObjectZodSchema = makeSchema();
