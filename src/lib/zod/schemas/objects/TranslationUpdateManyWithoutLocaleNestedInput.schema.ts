import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateManyLocaleInputEnvelopeObjectSchema } from "./TranslationCreateManyLocaleInputEnvelope.schema";
import { TranslationCreateOrConnectWithoutLocaleInputObjectSchema } from "./TranslationCreateOrConnectWithoutLocaleInput.schema";
import { TranslationCreateWithoutLocaleInputObjectSchema } from "./TranslationCreateWithoutLocaleInput.schema";
import { TranslationScalarWhereInputObjectSchema } from "./TranslationScalarWhereInput.schema";
import { TranslationUncheckedCreateWithoutLocaleInputObjectSchema } from "./TranslationUncheckedCreateWithoutLocaleInput.schema";
import { TranslationUpdateManyWithWhereWithoutLocaleInputObjectSchema } from "./TranslationUpdateManyWithWhereWithoutLocaleInput.schema";
import { TranslationUpdateWithWhereUniqueWithoutLocaleInputObjectSchema } from "./TranslationUpdateWithWhereUniqueWithoutLocaleInput.schema";
import { TranslationUpsertWithWhereUniqueWithoutLocaleInputObjectSchema } from "./TranslationUpsertWithWhereUniqueWithoutLocaleInput.schema";
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
      upsert: z
        .union([
          z.lazy(
            () => TranslationUpsertWithWhereUniqueWithoutLocaleInputObjectSchema
          ),
          z
            .lazy(
              () =>
                TranslationUpsertWithWhereUniqueWithoutLocaleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => TranslationCreateManyLocaleInputEnvelopeObjectSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => TranslationWhereUniqueInputObjectSchema),
          z.lazy(() => TranslationWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => TranslationWhereUniqueInputObjectSchema),
          z.lazy(() => TranslationWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => TranslationWhereUniqueInputObjectSchema),
          z.lazy(() => TranslationWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => TranslationWhereUniqueInputObjectSchema),
          z.lazy(() => TranslationWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => TranslationUpdateWithWhereUniqueWithoutLocaleInputObjectSchema
          ),
          z
            .lazy(
              () =>
                TranslationUpdateWithWhereUniqueWithoutLocaleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => TranslationUpdateManyWithWhereWithoutLocaleInputObjectSchema
          ),
          z
            .lazy(
              () => TranslationUpdateManyWithWhereWithoutLocaleInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => TranslationScalarWhereInputObjectSchema),
          z.lazy(() => TranslationScalarWhereInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const TranslationUpdateManyWithoutLocaleNestedInputObjectSchema: z.ZodType<Prisma.TranslationUpdateManyWithoutLocaleNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationUpdateManyWithoutLocaleNestedInput>;
export const TranslationUpdateManyWithoutLocaleNestedInputObjectZodSchema =
  makeSchema();
