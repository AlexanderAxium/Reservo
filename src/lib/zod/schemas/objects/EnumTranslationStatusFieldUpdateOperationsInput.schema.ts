import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationStatusSchema } from "../enums/TranslationStatus.schema";

const makeSchema = () =>
  z
    .object({
      set: TranslationStatusSchema.optional(),
    })
    .strict();
export const EnumTranslationStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTranslationStatusFieldUpdateOperationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumTranslationStatusFieldUpdateOperationsInput>;
export const EnumTranslationStatusFieldUpdateOperationsInputObjectZodSchema =
  makeSchema();
