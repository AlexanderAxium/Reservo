import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationUncheckedUpdateWithoutLocaleInputObjectSchema } from "./TranslationUncheckedUpdateWithoutLocaleInput.schema";
import { TranslationUpdateWithoutLocaleInputObjectSchema } from "./TranslationUpdateWithoutLocaleInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./TranslationWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TranslationWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => TranslationUpdateWithoutLocaleInputObjectSchema),
        z.lazy(() => TranslationUncheckedUpdateWithoutLocaleInputObjectSchema),
      ]),
    })
    .strict();
export const TranslationUpdateWithWhereUniqueWithoutLocaleInputObjectSchema: z.ZodType<Prisma.TranslationUpdateWithWhereUniqueWithoutLocaleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationUpdateWithWhereUniqueWithoutLocaleInput>;
export const TranslationUpdateWithWhereUniqueWithoutLocaleInputObjectZodSchema =
  makeSchema();
