import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";
import { TenantCreateNestedOneWithoutPermissionsInputObjectSchema } from "./TenantCreateNestedOneWithoutPermissionsInput.schema";

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
      tenant: z.lazy(
        () => TenantCreateNestedOneWithoutPermissionsInputObjectSchema
      ),
    })
    .strict();
export const PermissionCreateWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.PermissionCreateWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateWithoutRolePermissionsInput>;
export const PermissionCreateWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
