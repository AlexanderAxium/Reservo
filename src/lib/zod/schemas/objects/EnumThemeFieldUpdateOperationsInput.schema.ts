import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { ThemeSchema } from "../enums/Theme.schema";

const makeSchema = () =>
  z
    .object({
      set: ThemeSchema.optional(),
    })
    .strict();
export const EnumThemeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumThemeFieldUpdateOperationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumThemeFieldUpdateOperationsInput>;
export const EnumThemeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
