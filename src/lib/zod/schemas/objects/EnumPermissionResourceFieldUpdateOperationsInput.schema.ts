import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";

const makeSchema = () =>
  z
    .object({
      set: PermissionResourceSchema.optional(),
    })
    .strict();
export const EnumPermissionResourceFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPermissionResourceFieldUpdateOperationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumPermissionResourceFieldUpdateOperationsInput>;
export const EnumPermissionResourceFieldUpdateOperationsInputObjectZodSchema =
  makeSchema();
