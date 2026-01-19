import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";
import { RolePermissionUncheckedCreateNestedManyWithoutPermissionInputObjectSchema } from "./RolePermissionUncheckedCreateNestedManyWithoutPermissionInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      action: PermissionActionSchema,
      resource: PermissionResourceSchema,
      description: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
      tenantId: z.string(),
      rolePermissions: z.lazy(
        () =>
          RolePermissionUncheckedCreateNestedManyWithoutPermissionInputObjectSchema
      ),
    })
    .strict();
export const PermissionUncheckedCreateInputObjectSchema: z.ZodType<Prisma.PermissionUncheckedCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionUncheckedCreateInput>;
export const PermissionUncheckedCreateInputObjectZodSchema = makeSchema();
