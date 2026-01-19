import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleCreateWithoutTranslationsInputObjectSchema } from "./LocaleCreateWithoutTranslationsInput.schema";
import { LocaleUncheckedCreateWithoutTranslationsInputObjectSchema } from "./LocaleUncheckedCreateWithoutTranslationsInput.schema";
import { LocaleWhereUniqueInputObjectSchema } from "./LocaleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => LocaleWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => LocaleCreateWithoutTranslationsInputObjectSchema),
        z.lazy(() => LocaleUncheckedCreateWithoutTranslationsInputObjectSchema),
      ]),
    })
    .strict();
export const LocaleCreateOrConnectWithoutTranslationsInputObjectSchema: z.ZodType<Prisma.LocaleCreateOrConnectWithoutTranslationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleCreateOrConnectWithoutTranslationsInput>;
export const LocaleCreateOrConnectWithoutTranslationsInputObjectZodSchema =
  makeSchema();
