import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationStatusSchema } from "../enums/TranslationStatus.schema";
import { DateTimeFieldUpdateOperationsInputObjectSchema } from "./DateTimeFieldUpdateOperationsInput.schema";
import { EnumTranslationStatusFieldUpdateOperationsInputObjectSchema } from "./EnumTranslationStatusFieldUpdateOperationsInput.schema";
import { LocaleUpdateOneRequiredWithoutTranslationsNestedInputObjectSchema } from "./LocaleUpdateOneRequiredWithoutTranslationsNestedInput.schema";
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema } from "./NullableDateTimeFieldUpdateOperationsInput.schema";
import { NullableStringFieldUpdateOperationsInputObjectSchema } from "./NullableStringFieldUpdateOperationsInput.schema";
import { StringFieldUpdateOperationsInputObjectSchema } from "./StringFieldUpdateOperationsInput.schema";
import { TenantUpdateOneWithoutTranslationsNestedInputObjectSchema } from "./TenantUpdateOneWithoutTranslationsNestedInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      translatableType: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      translatableId: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      fieldName: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      translatedValue: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      translationStatus: z
        .union([
          TranslationStatusSchema,
          z.lazy(
            () => EnumTranslationStatusFieldUpdateOperationsInputObjectSchema
          ),
        ])
        .optional(),
      translatorNotes: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      approvedBy: z
        .union([
          z.string(),
          z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      approvedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional()
        .nullable(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
      locale: z
        .lazy(
          () =>
            LocaleUpdateOneRequiredWithoutTranslationsNestedInputObjectSchema
        )
        .optional(),
      tenant: z
        .lazy(() => TenantUpdateOneWithoutTranslationsNestedInputObjectSchema)
        .optional(),
    })
    .strict();
export const TranslationUpdateInputObjectSchema: z.ZodType<Prisma.TranslationUpdateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationUpdateInput>;
export const TranslationUpdateInputObjectZodSchema = makeSchema();
