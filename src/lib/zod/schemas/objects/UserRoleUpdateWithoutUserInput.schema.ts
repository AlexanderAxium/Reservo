import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { DateTimeFieldUpdateOperationsInputObjectSchema } from "./DateTimeFieldUpdateOperationsInput.schema";
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from "./NullableDateTimeFieldUpdateOperationsInput.schema";
import { NullableStringFieldUpdateOperationsInputObjectSchema } from "./NullableStringFieldUpdateOperationsInput.schema";
import { RoleUpdateOneRequiredWithoutUserRolesNestedInputObjectSchema } from "./RoleUpdateOneRequiredWithoutUserRolesNestedInput.schema";
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
      assignedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      assignedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      expiresAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      role: z
        .lazy(
          () => RoleUpdateOneRequiredWithoutUserRolesNestedInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const UserRoleUpdateWithoutUserInputObjectSchema: z.ZodType<Prisma.UserRoleUpdateWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUpdateWithoutUserInput>;
export const UserRoleUpdateWithoutUserInputObjectZodSchema = makeSchema();
