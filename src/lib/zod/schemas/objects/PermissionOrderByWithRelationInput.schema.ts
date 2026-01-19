import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { RolePermissionOrderByRelationAggregateInputObjectSchema } from "./RolePermissionOrderByRelationAggregateInput.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";
import { TenantOrderByWithRelationInputObjectSchema } from "./TenantOrderByWithRelationInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      action: SortOrderSchema.optional(),
      resource: SortOrderSchema.optional(),
      description: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      isActive: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      tenantId: SortOrderSchema.optional(),
      tenant: z
        .lazy(() => TenantOrderByWithRelationInputObjectSchema)
        .optional(),
      rolePermissions: z
        .lazy(() => RolePermissionOrderByRelationAggregateInputObjectSchema)
        .optional(),
    })
    .strict();
export const PermissionOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PermissionOrderByWithRelationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionOrderByWithRelationInput>;
export const PermissionOrderByWithRelationInputObjectZodSchema = makeSchema();
