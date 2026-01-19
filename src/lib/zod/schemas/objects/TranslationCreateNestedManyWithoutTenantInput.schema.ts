import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateManyTenantInputEnvelopeObjectSchema } from "./TranslationCreateManyTenantInputEnvelope.schema";
import { TranslationCreateOrConnectWithoutTenantInputObjectSchema } from "./TranslationCreateOrConnectWithoutTenantInput.schema";
import { TranslationCreateWithoutTenantInputObjectSchema } from "./TranslationCreateWithoutTenantInput.schema";
import { TranslationUncheckedCreateWithoutTenantInputObjectSchema } from "./TranslationUncheckedCreateWithoutTenantInput.schema";
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
      createMany: z
        .lazy(() => TranslationCreateManyTenantInputEnvelopeObjectSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => TranslationWhereUniqueInputObjectSchema),
          z.lazy(() => TranslationWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();
export const TranslationCreateNestedManyWithoutTenantInputObjectSchema: z.ZodType<Prisma.TranslationCreateNestedManyWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationCreateNestedManyWithoutTenantInput>;
export const TranslationCreateNestedManyWithoutTenantInputObjectZodSchema =
  makeSchema();
