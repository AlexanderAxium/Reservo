import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      name: z.string(),
      displayName: z.string(),
      description: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
      isSystem: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();
export const RoleCreateManyTenantInputObjectSchema: z.ZodType<Prisma.RoleCreateManyTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateManyTenantInput>;
export const RoleCreateManyTenantInputObjectZodSchema = makeSchema();
