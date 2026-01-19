import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleCreateWithoutTranslationsInputObjectSchema } from "./LocaleCreateWithoutTranslationsInput.schema";
import { LocaleUncheckedCreateWithoutTranslationsInputObjectSchema } from "./LocaleUncheckedCreateWithoutTranslationsInput.schema";
import { LocaleUncheckedUpdateWithoutTranslationsInputObjectSchema } from "./LocaleUncheckedUpdateWithoutTranslationsInput.schema";
import { LocaleUpdateWithoutTranslationsInputObjectSchema } from "./LocaleUpdateWithoutTranslationsInput.schema";
import { LocaleWhereInputObjectSchema } from "./LocaleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      update: z.union([
        z.lazy(() => LocaleUpdateWithoutTranslationsInputObjectSchema),
        z.lazy(() => LocaleUncheckedUpdateWithoutTranslationsInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => LocaleCreateWithoutTranslationsInputObjectSchema),
        z.lazy(() => LocaleUncheckedCreateWithoutTranslationsInputObjectSchema),
      ]),
      where: z.lazy(() => LocaleWhereInputObjectSchema).optional(),
    })
    .strict();
export const LocaleUpsertWithoutTranslationsInputObjectSchema: z.ZodType<Prisma.LocaleUpsertWithoutTranslationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleUpsertWithoutTranslationsInput>;
export const LocaleUpsertWithoutTranslationsInputObjectZodSchema = makeSchema();
