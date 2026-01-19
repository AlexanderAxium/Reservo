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
      roleId: z
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
export const RolePermissionUncheckedUpdateWithoutPermissionInputObjectSchema: z.ZodType<Prisma.RolePermissionUncheckedUpdateWithoutPermissionInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUncheckedUpdateWithoutPermissionInput>;
export const RolePermissionUncheckedUpdateWithoutPermissionInputObjectZodSchema =
  makeSchema();
