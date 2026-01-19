import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleScalarFieldEnumSchema } from "./enums/LocaleScalarFieldEnum.schema";
import { LocaleIncludeObjectSchema } from "./objects/LocaleInclude.schema";
import { LocaleOrderByWithRelationInputObjectSchema } from "./objects/LocaleOrderByWithRelationInput.schema";
import { LocaleWhereInputObjectSchema } from "./objects/LocaleWhereInput.schema";
import { LocaleWhereUniqueInputObjectSchema } from "./objects/LocaleWhereUniqueInput.schema";

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const LocaleFindFirstSelectSchema: z.ZodType<Prisma.LocaleSelect> = z
  .object({
    id: z.boolean().optional(),
    languageCode: z.boolean().optional(),
    name: z.boolean().optional(),
    nativeName: z.boolean().optional(),
    locale: z.boolean().optional(),
    direction: z.boolean().optional(),
    currencySymbol: z.boolean().optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    flagUrl: z.boolean().optional(),
    displayOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    translations: z.boolean().optional(),
    _count: z.boolean().optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleSelect>;

export const LocaleFindFirstSelectZodSchema = z
  .object({
    id: z.boolean().optional(),
    languageCode: z.boolean().optional(),
    name: z.boolean().optional(),
    nativeName: z.boolean().optional(),
    locale: z.boolean().optional(),
    direction: z.boolean().optional(),
    currencySymbol: z.boolean().optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    flagUrl: z.boolean().optional(),
    displayOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    translations: z.boolean().optional(),
    _count: z.boolean().optional(),
  })
  .strict();

export const LocaleFindFirstSchema: z.ZodType<Prisma.LocaleFindFirstArgs> = z
  .object({
    select: LocaleFindFirstSelectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    orderBy: z
      .union([
        LocaleOrderByWithRelationInputObjectSchema,
        LocaleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: LocaleWhereInputObjectSchema.optional(),
    cursor: LocaleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([LocaleScalarFieldEnumSchema, LocaleScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleFindFirstArgs>;

export const LocaleFindFirstZodSchema = z
  .object({
    select: LocaleFindFirstSelectSchema.optional(),
    include: LocaleIncludeObjectSchema.optional(),
    orderBy: z
      .union([
        LocaleOrderByWithRelationInputObjectSchema,
        LocaleOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: LocaleWhereInputObjectSchema.optional(),
    cursor: LocaleWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([LocaleScalarFieldEnumSchema, LocaleScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();
