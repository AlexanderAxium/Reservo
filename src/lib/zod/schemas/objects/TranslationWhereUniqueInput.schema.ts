import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationTranslatableTypeTranslatableIdLocaleIdFieldNameTenantIdCompoundUniqueInputObjectSchema } from "./TranslationTranslatableTypeTranslatableIdLocaleIdFieldNameTenantIdCompoundUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      translatableType_translatableId_localeId_fieldName_tenantId: z
        .lazy(
          () =>
            TranslationTranslatableTypeTranslatableIdLocaleIdFieldNameTenantIdCompoundUniqueInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const TranslationWhereUniqueInputObjectSchema: z.ZodType<Prisma.TranslationWhereUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationWhereUniqueInput>;
export const TranslationWhereUniqueInputObjectZodSchema = makeSchema();
