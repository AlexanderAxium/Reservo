import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TranslationScalarFieldEnumSchema } from "./enums/TranslationScalarFieldEnum.schema";
import { TranslationIncludeObjectSchema } from "./objects/TranslationInclude.schema";
import { TranslationOrderByWithRelationInputObjectSchema } from "./objects/TranslationOrderByWithRelationInput.schema";
import { TranslationWhereInputObjectSchema } from "./objects/TranslationWhereInput.schema";
import { TranslationWhereUniqueInputObjectSchema } from "./objects/TranslationWhereUniqueInput.schema";

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TranslationFindFirstSelectSchema: z.ZodType<Prisma.TranslationSelect> =
  z
    .object({
      id: z.boolean().optional(),
      translatableType: z.boolean().optional(),
      translatableId: z.boolean().optional(),
      localeId: z.boolean().optional(),
      locale: z.boolean().optional(),
      fieldName: z.boolean().optional(),
      translatedValue: z.boolean().optional(),
      translationStatus: z.boolean().optional(),
      translatorNotes: z.boolean().optional(),
      approvedBy: z.boolean().optional(),
      approvedAt: z.boolean().optional(),
      tenantId: z.boolean().optional(),
      tenant: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      updatedAt: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationSelect>;

export const TranslationFindFirstSelectZodSchema = z
  .object({
    id: z.boolean().optional(),
    translatableType: z.boolean().optional(),
    translatableId: z.boolean().optional(),
    localeId: z.boolean().optional(),
    locale: z.boolean().optional(),
    fieldName: z.boolean().optional(),
    translatedValue: z.boolean().optional(),
    translationStatus: z.boolean().optional(),
    translatorNotes: z.boolean().optional(),
    approvedBy: z.boolean().optional(),
    approvedAt: z.boolean().optional(),
    tenantId: z.boolean().optional(),
    tenant: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
  })
  .strict();

export const TranslationFindFirstSchema: z.ZodType<Prisma.TranslationFindFirstArgs> =
  z
    .object({
      select: TranslationFindFirstSelectSchema.optional(),
      include: TranslationIncludeObjectSchema.optional(),
      orderBy: z
        .union([
          TranslationOrderByWithRelationInputObjectSchema,
          TranslationOrderByWithRelationInputObjectSchema.array(),
        ])
        .optional(),
      where: TranslationWhereInputObjectSchema.optional(),
      cursor: TranslationWhereUniqueInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          TranslationScalarFieldEnumSchema,
          TranslationScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TranslationFindFirstArgs>;

export const TranslationFindFirstZodSchema = z
  .object({
    select: TranslationFindFirstSelectSchema.optional(),
    include: TranslationIncludeObjectSchema.optional(),
    orderBy: z
      .union([
        TranslationOrderByWithRelationInputObjectSchema,
        TranslationOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: TranslationWhereInputObjectSchema.optional(),
    cursor: TranslationWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([
        TranslationScalarFieldEnumSchema,
        TranslationScalarFieldEnumSchema.array(),
      ])
      .optional(),
  })
  .strict();
