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
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const RolePermissionUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.RolePermissionUpdateManyMutationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionUpdateManyMutationInput>;
export const RolePermissionUpdateManyMutationInputObjectZodSchema =
  makeSchema();
