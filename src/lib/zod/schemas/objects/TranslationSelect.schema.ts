import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleArgsObjectSchema } from "./LocaleArgs.schema";
import { TenantArgsObjectSchema } from "./TenantArgs.schema";

const makeSchema = () =>
  z
    .object({
      id: z.boolean().optional(),
      translatableType: z.boolean().optional(),
      translatableId: z.boolean().optional(),
      localeId: z.boolean().optional(),
      locale: z
        .union([z.boolean(), z.lazy(() => LocaleArgsObjectSchema)])
        .optional(),
      fieldName: z.boolean().optional(),
      translatedValue: z.boolean().optional(),
      translationStatus: z.boolean().optional(),
      translatorNotes: z.boolean().optional(),
      approvedBy: z.boolean().optional(),
      approvedAt: z.boolean().optional(),
      tenantId: z.boolean().optional(),
      tenant: z
        .union([z.boolean(), z.lazy(() => TenantArgsObjectSchema)])
        .optional(),
      createdAt: z.boolean().optional(),
      updatedAt: z.boolean().optional(),
    })
    .strict();
export const TranslationSelectObjectSchema: z.ZodType<Prisma.TranslationSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationSelect>;
export const TranslationSelectObjectZodSchema = makeSchema();
