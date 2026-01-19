import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";
import { RolePermissionCreateNestedManyWithoutPermissionInputObjectSchema } from "./RolePermissionCreateNestedManyWithoutPermissionInput.schema";

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
      rolePermissions: z
        .lazy(
          () => RolePermissionCreateNestedManyWithoutPermissionInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const PermissionCreateWithoutTenantInputObjectSchema: z.ZodType<Prisma.PermissionCreateWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateWithoutTenantInput>;
export const PermissionCreateWithoutTenantInputObjectZodSchema = makeSchema();
