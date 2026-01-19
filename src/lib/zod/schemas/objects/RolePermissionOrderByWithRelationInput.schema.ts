import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { PermissionOrderByWithRelationInputObjectSchema } from "./PermissionOrderByWithRelationInput.schema";
import { RoleOrderByWithRelationInputObjectSchema } from "./RoleOrderByWithRelationInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      roleId: SortOrderSchema.optional(),
      permissionId: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      permission: z
        .lazy(() => PermissionOrderByWithRelationInputObjectSchema)
        .optional(),
      role: z.lazy(() => RoleOrderByWithRelationInputObjectSchema).optional(),
    })
    .strict();
export const RolePermissionOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.RolePermissionOrderByWithRelationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionOrderByWithRelationInput>;
export const RolePermissionOrderByWithRelationInputObjectZodSchema =
  makeSchema();
