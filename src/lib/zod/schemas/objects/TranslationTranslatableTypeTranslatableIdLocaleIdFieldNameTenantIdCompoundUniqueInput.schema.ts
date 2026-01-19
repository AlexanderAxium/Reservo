import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      translatableType: z.string(),
      translatableId: z.string(),
      localeId: z.string(),
      fieldName: z.string(),
      tenantId: z.string(),
    })
    .strict();
export const TranslationTranslatableTypeTranslatableIdLocaleIdFieldNameTenantIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.TranslationTranslatableTypeTranslatableIdLocaleIdFieldNameTenantIdCompoundUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationTranslatableTypeTranslatableIdLocaleIdFieldNameTenantIdCompoundUniqueInput>;
export const TranslationTranslatableTypeTranslatableIdLocaleIdFieldNameTenantIdCompoundUniqueInputObjectZodSchema =
  makeSchema();
