import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { RolePermissionOrderByRelationAggregateInputObjectSchema } from "./RolePermissionOrderByRelationAggregateInput.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";
import { TenantOrderByWithRelationInputObjectSchema } from "./TenantOrderByWithRelationInput.schema";
import { UserRoleOrderByRelationAggregateInputObjectSchema } from "./UserRoleOrderByRelationAggregateInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      name: SortOrderSchema.optional(),
      displayName: SortOrderSchema.optional(),
      description: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      isActive: SortOrderSchema.optional(),
      isSystem: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      tenantId: SortOrderSchema.optional(),
      rolePermissions: z
        .lazy(() => RolePermissionOrderByRelationAggregateInputObjectSchema)
        .optional(),
      tenant: z
        .lazy(() => TenantOrderByWithRelationInputObjectSchema)
        .optional(),
      userRoles: z
        .lazy(() => UserRoleOrderByRelationAggregateInputObjectSchema)
        .optional(),
    })
    .strict();
export const RoleOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.RoleOrderByWithRelationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleOrderByWithRelationInput>;
export const RoleOrderByWithRelationInputObjectZodSchema = makeSchema();
