import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LanguageSchema } from "../enums/Language.schema";

const makeSchema = () =>
  z
    .object({
      set: LanguageSchema.optional(),
    })
    .strict();
export const EnumLanguageFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumLanguageFieldUpdateOperationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumLanguageFieldUpdateOperationsInput>;
export const EnumLanguageFieldUpdateOperationsInputObjectZodSchema =
  makeSchema();
