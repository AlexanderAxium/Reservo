import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleUncheckedUpdateWithoutTranslationsInputObjectSchema } from "./LocaleUncheckedUpdateWithoutTranslationsInput.schema";
import { LocaleUpdateWithoutTranslationsInputObjectSchema } from "./LocaleUpdateWithoutTranslationsInput.schema";
import { LocaleWhereInputObjectSchema } from "./LocaleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => LocaleWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => LocaleUpdateWithoutTranslationsInputObjectSchema),
        z.lazy(() => LocaleUncheckedUpdateWithoutTranslationsInputObjectSchema),
      ]),
    })
    .strict();
export const LocaleUpdateToOneWithWhereWithoutTranslationsInputObjectSchema: z.ZodType<Prisma.LocaleUpdateToOneWithWhereWithoutTranslationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleUpdateToOneWithWhereWithoutTranslationsInput>;
export const LocaleUpdateToOneWithWhereWithoutTranslationsInputObjectZodSchema =
  makeSchema();
