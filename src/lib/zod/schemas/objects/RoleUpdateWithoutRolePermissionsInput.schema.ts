import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { BoolFieldUpdateOperationsInputObjectSchema } from "./BoolFieldUpdateOperationsInput.schema";
import { DateTimeFieldUpdateOperationsInputObjectSchema } from "./DateTimeFieldUpdateOperationsInput.schema";
import { NullableStringFieldUpdateOperationsInputObjectSchema } from "./NullableStringFieldUpdateOperationsInput.schema";
import { StringFieldUpdateOperationsInputObjectSchema } from "./StringFieldUpdateOperationsInput.schema";
import { TenantUpdateOneRequiredWithoutRolesNestedInputObjectSchema } from "./TenantUpdateOneRequiredWithoutRolesNestedInput.schema";
import { UserRoleUpdateManyWithoutRoleNestedInputObjectSchema } from "./UserRoleUpdateManyWithoutRoleNestedInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      displayName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      description: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      isActive: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      isSystem: z
        .union([
          z.boolean(),
          z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      tenant: z
        .lazy(() => TenantUpdateOneRequiredWithoutRolesNestedInputObjectSchema)
        .optional(),
      userRoles: z
        .lazy(() => UserRoleUpdateManyWithoutRoleNestedInputObjectSchema)
        .optional(),
    })
    .strict();
export const RoleUpdateWithoutRolePermissionsInputObjectSchema: z.ZodType<Prisma.RoleUpdateWithoutRolePermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleUpdateWithoutRolePermissionsInput>;
export const RoleUpdateWithoutRolePermissionsInputObjectZodSchema =
  makeSchema();
