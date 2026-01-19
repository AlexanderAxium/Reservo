import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";

const makeSchema = () =>
  z
    .object({
      set: PermissionActionSchema.optional(),
    })
    .strict();
export const EnumPermissionActionFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumPermissionActionFieldUpdateOperationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumPermissionActionFieldUpdateOperationsInput>;
export const EnumPermissionActionFieldUpdateOperationsInputObjectZodSchema =
  makeSchema();
