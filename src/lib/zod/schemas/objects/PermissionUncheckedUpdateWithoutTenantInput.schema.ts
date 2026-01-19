import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";
import { BoolFieldUpdateOperationsInputObjectSchema } from "./BoolFieldUpdateOperationsInput.schema";
import { DateTimeFieldUpdateOperationsInputObjectSchema } from "./DateTimeFieldUpdateOperationsInput.schema";
import { EnumPermissionActionFieldUpdateOperationsInputObjectSchema } from "./EnumPermissionActionFieldUpdateOperationsInput.schema";
import { EnumPermissionResourceFieldUpdateOperationsInputObjectSchema } from "./EnumPermissionResourceFieldUpdateOperationsInput.schema";
import { NullableStringFieldUpdateOperationsInputObjectSchema } from "./NullableStringFieldUpdateOperationsInput.schema";
import { RolePermissionUncheckedUpdateManyWithoutPermissionNestedInputObjectSchema } from "./RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput.schema";
import { StringFieldUpdateOperationsInputObjectSchema } from "./StringFieldUpdateOperationsInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      action: z
        .union([
          PermissionActionSchema,
          z.lazy(
            () => EnumPermissionActionFieldUpdateOperationsInputObjectSchema
          ),
        ])
        .optional(),
      resource: z
        .union([
          PermissionResourceSchema,
          z.lazy(
            () => EnumPermissionResourceFieldUpdateOperationsInputObjectSchema
          ),
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
      rolePermissions: z
        .lazy(
          () =>
            RolePermissionUncheckedUpdateManyWithoutPermissionNestedInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const PermissionUncheckedUpdateWithoutTenantInputObjectSchema: z.ZodType<Prisma.PermissionUncheckedUpdateWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionUncheckedUpdateWithoutTenantInput>;
export const PermissionUncheckedUpdateWithoutTenantInputObjectZodSchema =
  makeSchema();
