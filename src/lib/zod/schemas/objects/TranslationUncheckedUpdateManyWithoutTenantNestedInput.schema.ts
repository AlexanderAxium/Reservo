import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateManyTenantInputEnvelopeObjectSchema } from "./TranslationCreateManyTenantInputEnvelope.schema";
import { TranslationCreateOrConnectWithoutTenantInputObjectSchema } from "./TranslationCreateOrConnectWithoutTenantInput.schema";
import { TranslationCreateWithoutTenantInputObjectSchema } from "./TranslationCreateWithoutTenantInput.schema";
import { TranslationScalarWhereInputObjectSchema } from "./TranslationScalarWhereInput.schema";
import { TranslationUncheckedCreateWithoutTenantInputObjectSchema } from "./TranslationUncheckedCreateWithoutTenantInput.schema";
import { TranslationUpdateManyWithWhereWithoutTenantInputObjectSchema } from "./TranslationUpdateManyWithWhereWithoutTenantInput.schema";
import { TranslationUpdateWithWhereUniqueWithoutTenantInputObjectSchema } from "./TranslationUpdateWithWhereUniqueWithoutTenantInput.schema";
import { TranslationUpsertWithWhereUniqueWithoutTenantInputObjectSchema } from "./TranslationUpsertWithWhereUniqueWithoutTenantInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./TranslationWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => TranslationCreateWithoutTenantInputObjectSchema),
          z.lazy(() => TranslationCreateWithoutTenantInputObjectSchema).array(),
          z.lazy(
            () => TranslationUncheckedCreateWithoutTenantInputObjectSchema
          ),
          z
            .lazy(
              () => TranslationUncheckedCreateWithoutTenantInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => TranslationCreateOrConnectWithoutTenantInputObjectSchema
          ),
          z
            .lazy(
              () => TranslationCreateOrConnectWithoutTenantInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => TranslationUpsertWithWhereUniqueWithoutTenantInputObjectSchema
          ),
          z
            .lazy(
              () =>
                TranslationUpsertWithWhereUniqueWithoutTenantInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => TranslationCreateManyTenantInputEnvelopeObjectSchema)
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
            () => TranslationUpdateWithWhereUniqueWithoutTenantInputObjectSchema
          ),
          z
            .lazy(
              () =>
                TranslationUpdateWithWhereUniqueWithoutTenantInputObjectSchema
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => TranslationUpdateManyWithWhereWithoutTenantInputObjectSchema
          ),
          z
            .lazy(
              () => TranslationUpdateManyWithWhereWithoutTenantInputObjectSchema
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
export const TranslationUncheckedUpdateManyWithoutTenantNestedInputObjectSchema: z.ZodType<Prisma.TranslationUncheckedUpdateManyWithoutTenantNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationUncheckedUpdateManyWithoutTenantNestedInput>;
export const TranslationUncheckedUpdateManyWithoutTenantNestedInputObjectZodSchema =
  makeSchema();
