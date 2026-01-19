import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { DateTimeFieldUpdateOperationsInputObjectSchema } from "./DateTimeFieldUpdateOperationsInput.schema";
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
      permissionId: z
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
    })
    .strict();
export const RolePermissionUncheckedUpdateWithoutRoleInputObjectSchema: z.ZodType<Prisma.RolePermissionUncheckedUpdateWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUncheckedUpdateWithoutRoleInput>;
export const RolePermissionUncheckedUpdateWithoutRoleInputObjectZodSchema =
  makeSchema();
