import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      action: PermissionActionSchema,
      resource: PermissionResourceSchema,
      description: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      tenantId: z.string(),
    })
    .strict();
export const PermissionCreateManyInputObjectSchema: z.ZodType<Prisma.PermissionCreateManyInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateManyInput>;
export const PermissionCreateManyInputObjectZodSchema = makeSchema();
