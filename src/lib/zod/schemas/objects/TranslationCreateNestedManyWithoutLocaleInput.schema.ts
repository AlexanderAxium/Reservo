import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateManyLocaleInputEnvelopeObjectSchema } from "./TranslationCreateManyLocaleInputEnvelope.schema";
import { TranslationCreateOrConnectWithoutLocaleInputObjectSchema } from "./TranslationCreateOrConnectWithoutLocaleInput.schema";
import { TranslationCreateWithoutLocaleInputObjectSchema } from "./TranslationCreateWithoutLocaleInput.schema";
import { TranslationUncheckedCreateWithoutLocaleInputObjectSchema } from "./TranslationUncheckedCreateWithoutLocaleInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./TranslationWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => TranslationCreateWithoutLocaleInputObjectSchema),
          z.lazy(() => TranslationCreateWithoutLocaleInputObjectSchema).array(),
          z.lazy(
            () => TranslationUncheckedCreateWithoutLocaleInputObjectSchema
          ),
          z
            .lazy(
              () => TranslationUncheckedCreateWithoutLocaleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => TranslationCreateOrConnectWithoutLocaleInputObjectSchema
          ),
          z
            .lazy(
              () => TranslationCreateOrConnectWithoutLocaleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => TranslationCreateManyLocaleInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => TranslationWhereUniqueInputObjectSchema),
          z.lazy(() => TranslationWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const TranslationCreateNestedManyWithoutLocaleInputObjectSchema: z.ZodType<Prisma.TranslationCreateNestedManyWithoutLocaleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationCreateNestedManyWithoutLocaleInput>;
export const TranslationCreateNestedManyWithoutLocaleInputObjectZodSchema =
  makeSchema();
