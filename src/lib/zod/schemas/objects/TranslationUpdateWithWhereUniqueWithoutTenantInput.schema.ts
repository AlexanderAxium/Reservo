import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationUncheckedUpdateWithoutTenantInputObjectSchema } from "./TranslationUncheckedUpdateWithoutTenantInput.schema";
import { TranslationUpdateWithoutTenantInputObjectSchema } from "./TranslationUpdateWithoutTenantInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./TranslationWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TranslationWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => TranslationUpdateWithoutTenantInputObjectSchema),
        z.lazy(() => TranslationUncheckedUpdateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const TranslationUpdateWithWhereUniqueWithoutTenantInputObjectSchema: z.ZodType<Prisma.TranslationUpdateWithWhereUniqueWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationUpdateWithWhereUniqueWithoutTenantInput>;
export const TranslationUpdateWithWhereUniqueWithoutTenantInputObjectZodSchema =
  makeSchema();
