import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { BoolFilterObjectSchema } from "./BoolFilter.schema";
import { DateTimeFilterObjectSchema } from "./DateTimeFilter.schema";
import { IntFilterObjectSchema } from "./IntFilter.schema";
import { StringFilterObjectSchema } from "./StringFilter.schema";
import { StringNullableFilterObjectSchema } from "./StringNullableFilter.schema";
import { TranslationListRelationFilterObjectSchema } from "./TranslationListRelationFilter.schema";

const localewhereinputSchema = z
  .object({
    AND: z
      .union([
        z.lazy(() => LocaleWhereInputObjectSchema),
        z.lazy(() => LocaleWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => LocaleWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => LocaleWhereInputObjectSchema),
        z.lazy(() => LocaleWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    languageCode: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    nativeName: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    locale: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    direction: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    currencySymbol: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    isActive: z
      .union([z.lazy(() => BoolFilterObjectSchema), z.boolean()])
      .optional(),
    isDefault: z
      .union([z.lazy(() => BoolFilterObjectSchema), z.boolean()])
      .optional(),
    flagUrl: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    displayOrder: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number().int()])
      .optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()])
      .optional(),
    translations: z
      .lazy(() => TranslationListRelationFilterObjectSchema)
      .optional(),
  })
  .strict();
export const LocaleWhereInputObjectSchema: z.ZodType<Prisma.LocaleWhereInput> =
  localewhereinputSchema as unknown as z.ZodType<Prisma.LocaleWhereInput>;
export const LocaleWhereInputObjectZodSchema = localewhereinputSchema;
