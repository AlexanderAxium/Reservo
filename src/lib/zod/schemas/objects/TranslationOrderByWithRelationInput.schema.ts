import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { LocaleOrderByWithRelationInputObjectSchema } from "./LocaleOrderByWithRelationInput.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";
import { TenantOrderByWithRelationInputObjectSchema } from "./TenantOrderByWithRelationInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      translatableType: SortOrderSchema.optional(),
      translatableId: SortOrderSchema.optional(),
      localeId: SortOrderSchema.optional(),
      fieldName: SortOrderSchema.optional(),
      translatedValue: SortOrderSchema.optional(),
      translationStatus: SortOrderSchema.optional(),
      translatorNotes: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      approvedBy: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      approvedAt: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      tenantId: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      locale: z
        .lazy(() => LocaleOrderByWithRelationInputObjectSchema)
        .optional(),
      tenant: z
        .lazy(() => TenantOrderByWithRelationInputObjectSchema)
        .optional(),
    })
    .strict();
export const TranslationOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TranslationOrderByWithRelationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationOrderByWithRelationInput>;
export const TranslationOrderByWithRelationInputObjectZodSchema = makeSchema();
