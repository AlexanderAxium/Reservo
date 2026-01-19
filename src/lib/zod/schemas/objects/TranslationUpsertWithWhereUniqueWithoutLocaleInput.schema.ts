import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateWithoutLocaleInputObjectSchema } from "./TranslationCreateWithoutLocaleInput.schema";
import { TranslationUncheckedCreateWithoutLocaleInputObjectSchema } from "./TranslationUncheckedCreateWithoutLocaleInput.schema";
import { TranslationUncheckedUpdateWithoutLocaleInputObjectSchema } from "./TranslationUncheckedUpdateWithoutLocaleInput.schema";
import { TranslationUpdateWithoutLocaleInputObjectSchema } from "./TranslationUpdateWithoutLocaleInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./TranslationWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TranslationWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => TranslationUpdateWithoutLocaleInputObjectSchema),
        z.lazy(() => TranslationUncheckedUpdateWithoutLocaleInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => TranslationCreateWithoutLocaleInputObjectSchema),
        z.lazy(() => TranslationUncheckedCreateWithoutLocaleInputObjectSchema),
      ]),
    })
    .strict();
export const TranslationUpsertWithWhereUniqueWithoutLocaleInputObjectSchema: z.ZodType<Prisma.TranslationUpsertWithWhereUniqueWithoutLocaleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationUpsertWithWhereUniqueWithoutLocaleInput>;
export const TranslationUpsertWithWhereUniqueWithoutLocaleInputObjectZodSchema =
  makeSchema();
