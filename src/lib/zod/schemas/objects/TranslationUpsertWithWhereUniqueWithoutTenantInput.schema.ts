import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateWithoutTenantInputObjectSchema } from "./TranslationCreateWithoutTenantInput.schema";
import { TranslationUncheckedCreateWithoutTenantInputObjectSchema } from "./TranslationUncheckedCreateWithoutTenantInput.schema";
import { TranslationUncheckedUpdateWithoutTenantInputObjectSchema } from "./TranslationUncheckedUpdateWithoutTenantInput.schema";
import { TranslationUpdateWithoutTenantInputObjectSchema } from "./TranslationUpdateWithoutTenantInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./TranslationWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TranslationWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => TranslationUpdateWithoutTenantInputObjectSchema),
        z.lazy(() => TranslationUncheckedUpdateWithoutTenantInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => TranslationCreateWithoutTenantInputObjectSchema),
        z.lazy(() => TranslationUncheckedCreateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const TranslationUpsertWithWhereUniqueWithoutTenantInputObjectSchema: z.ZodType<Prisma.TranslationUpsertWithWhereUniqueWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationUpsertWithWhereUniqueWithoutTenantInput>;
export const TranslationUpsertWithWhereUniqueWithoutTenantInputObjectZodSchema =
  makeSchema();
