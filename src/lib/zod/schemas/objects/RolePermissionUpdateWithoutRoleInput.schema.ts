import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { DateTimeFieldUpdateOperationsInputObjectSchema } from "./DateTimeFieldUpdateOperationsInput.schema";
import { PermissionUpdateOneRequiredWithoutRolePermissionsNestedInputObjectSchema } from "./PermissionUpdateOneRequiredWithoutRolePermissionsNestedInput.schema";
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
      permission: z
        .lazy(
          () =>
            PermissionUpdateOneRequiredWithoutRolePermissionsNestedInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const RolePermissionUpdateWithoutRoleInputObjectSchema: z.ZodType<Prisma.RolePermissionUpdateWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpdateWithoutRoleInput>;
export const RolePermissionUpdateWithoutRoleInputObjectZodSchema = makeSchema();
