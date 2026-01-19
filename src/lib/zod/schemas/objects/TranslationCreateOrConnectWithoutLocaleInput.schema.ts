import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateWithoutLocaleInputObjectSchema } from "./TranslationCreateWithoutLocaleInput.schema";
import { TranslationUncheckedCreateWithoutLocaleInputObjectSchema } from "./TranslationUncheckedCreateWithoutLocaleInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./TranslationWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TranslationWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => TranslationCreateWithoutLocaleInputObjectSchema),
        z.lazy(() => TranslationUncheckedCreateWithoutLocaleInputObjectSchema),
      ]),
    })
    .strict();
export const TranslationCreateOrConnectWithoutLocaleInputObjectSchema: z.ZodType<Prisma.TranslationCreateOrConnectWithoutLocaleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationCreateOrConnectWithoutLocaleInput>;
export const TranslationCreateOrConnectWithoutLocaleInputObjectZodSchema =
  makeSchema();
