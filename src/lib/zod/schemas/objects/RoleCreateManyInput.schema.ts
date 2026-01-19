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
      tenantId: z.string(),
    })
    .strict();
export const RoleCreateManyInputObjectSchema: z.ZodType<Prisma.RoleCreateManyInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateManyInput>;
export const RoleCreateManyInputObjectZodSchema = makeSchema();
