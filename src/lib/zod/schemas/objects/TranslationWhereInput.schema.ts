import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationStatusSchema } from "../enums/TranslationStatus.schema";
import { DateTimeFilterObjectSchema } from "./DateTimeFilter.schema";
import { DateTimeNullableFilterObjectSchema } from "./DateTimeNullableFilter.schema";
import { EnumTranslationStatusFilterObjectSchema } from "./EnumTranslationStatusFilter.schema";
import { LocaleScalarRelationFilterObjectSchema } from "./LocaleScalarRelationFilter.schema";
import { LocaleWhereInputObjectSchema } from "./LocaleWhereInput.schema";
import { StringFilterObjectSchema } from "./StringFilter.schema";
import { StringNullableFilterObjectSchema } from "./StringNullableFilter.schema";
import { TenantNullableScalarRelationFilterObjectSchema } from "./TenantNullableScalarRelationFilter.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";

const translationwhereinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => TranslationWhereInputObjectSchema),
        z.lazy(() => TranslationWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => TranslationWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => TranslationWhereInputObjectSchema),
        z.lazy(() => TranslationWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    translatableType: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    translatableId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    localeId: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    fieldName: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    translatedValue: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    translationStatus: z
      .union([
        z.lazy(() => EnumTranslationStatusFilterObjectSchema),
        TranslationStatusSchema,
      ])
      .optional(),
    translatorNotes: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    approvedBy: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    approvedAt: z
      .union([
        z.lazy(() => DateTimeNullableFilterObjectSchema),
        z.coerce.date(),
      ])
      .optional()
      .nullable(),
    tenantId: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
    locale: z
      .union([
        z.lazy(() => LocaleScalarRelationFilterObjectSchema),
        z.lazy(() => LocaleWhereInputObjectSchema),
      ])
      .optional(),
    tenant: z
      .union([
        z.lazy(() => TenantNullableScalarRelationFilterObjectSchema),
        z.lazy(() => TenantWhereInputObjectSchema),
      ])
      .optional(),
  })
  .strict();
export const TranslationWhereInputObjectSchema: z.ZodType<Prisma.TranslationWhereInput> =
  translationwhereinputSchema as unknown as z.ZodType<Prisma.TranslationWhereInput>;
export const TranslationWhereInputObjectZodSchema = translationwhereinputSchema;
