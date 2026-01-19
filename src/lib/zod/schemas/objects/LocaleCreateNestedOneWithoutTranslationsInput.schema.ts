import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleCreateOrConnectWithoutTranslationsInputObjectSchema } from "./LocaleCreateOrConnectWithoutTranslationsInput.schema";
import { LocaleCreateWithoutTranslationsInputObjectSchema } from "./LocaleCreateWithoutTranslationsInput.schema";
import { LocaleUncheckedCreateWithoutTranslationsInputObjectSchema } from "./LocaleUncheckedCreateWithoutTranslationsInput.schema";
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
      connect: z.lazy(() => LocaleWhereUniqueInputObjectSchema).optional(),
    })
    .strict();
export const LocaleCreateNestedOneWithoutTranslationsInputObjectSchema: z.ZodType<Prisma.LocaleCreateNestedOneWithoutTranslationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleCreateNestedOneWithoutTranslationsInput>;
export const LocaleCreateNestedOneWithoutTranslationsInputObjectZodSchema =
  makeSchema();
