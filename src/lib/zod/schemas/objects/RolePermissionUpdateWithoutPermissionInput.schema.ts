import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { DateTimeFieldUpdateOperationsInputObjectSchema } from "./DateTimeFieldUpdateOperationsInput.schema";
import { RoleUpdateOneRequiredWithoutRolePermissionsNestedInputObjectSchema } from "./RoleUpdateOneRequiredWithoutRolePermissionsNestedInput.schema";
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
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      role: z
        .lazy(
          () =>
            RoleUpdateOneRequiredWithoutRolePermissionsNestedInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const RolePermissionUpdateWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RolePermissionUpdateWithoutPermissionInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpdateWithoutPermissionInput>;
export const RolePermissionUpdateWithoutPermissionInputObjectZodSchema =
  makeSchema();
