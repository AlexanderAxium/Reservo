import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleCreateOrConnectWithoutTranslationsInputObjectSchema } from "./LocaleCreateOrConnectWithoutTranslationsInput.schema";
import { LocaleCreateWithoutTranslationsInputObjectSchema } from "./LocaleCreateWithoutTranslationsInput.schema";
import { LocaleUncheckedCreateWithoutTranslationsInputObjectSchema } from "./LocaleUncheckedCreateWithoutTranslationsInput.schema";
import { LocaleUncheckedUpdateWithoutTranslationsInputObjectSchema } from "./LocaleUncheckedUpdateWithoutTranslationsInput.schema";
import { LocaleUpdateToOneWithWhereWithoutTranslationsInputObjectSchema } from "./LocaleUpdateToOneWithWhereWithoutTranslationsInput.schema";
import { LocaleUpdateWithoutTranslationsInputObjectSchema } from "./LocaleUpdateWithoutTranslationsInput.schema";
import { LocaleUpsertWithoutTranslationsInputObjectSchema } from "./LocaleUpsertWithoutTranslationsInput.schema";
import { LocaleWhereUniqueInputObjectSchema } from "./LocaleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => LocaleCreateWithoutTranslationsInputObjectSchema),
          z.lazy(
            () => LocaleUncheckedCreateWithoutTranslationsInputObjectSchema
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => LocaleCreateOrConnectWithoutTranslationsInputObjectSchema)
        .optional(),
      upsert: z
        .lazy(() => LocaleUpsertWithoutTranslationsInputObjectSchema)
        .optional(),
      connect: z.lazy(() => LocaleWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => LocaleUpdateToOneWithWhereWithoutTranslationsInputObjectSchema
          ),
          z.lazy(() => LocaleUpdateWithoutTranslationsInputObjectSchema),
          z.lazy(
            () => LocaleUncheckedUpdateWithoutTranslationsInputObjectSchema
          ),
        ])
        .optional(),
    })
    .strict();
export const LocaleUpdateOneRequiredWithoutTranslationsNestedInputObjectSchema: z.ZodType<Prisma.LocaleUpdateOneRequiredWithoutTranslationsNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleUpdateOneRequiredWithoutTranslationsNestedInput>;
export const LocaleUpdateOneRequiredWithoutTranslationsNestedInputObjectZodSchema =
  makeSchema();
