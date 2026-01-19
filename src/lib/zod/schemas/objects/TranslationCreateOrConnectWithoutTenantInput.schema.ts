import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateWithoutTenantInputObjectSchema } from "./TranslationCreateWithoutTenantInput.schema";
import { TranslationUncheckedCreateWithoutTenantInputObjectSchema } from "./TranslationUncheckedCreateWithoutTenantInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./TranslationWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TranslationWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => TranslationCreateWithoutTenantInputObjectSchema),
        z.lazy(() => TranslationUncheckedCreateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const TranslationCreateOrConnectWithoutTenantInputObjectSchema: z.ZodType<Prisma.TranslationCreateOrConnectWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationCreateOrConnectWithoutTenantInput>;
export const TranslationCreateOrConnectWithoutTenantInputObjectZodSchema =
  makeSchema();
