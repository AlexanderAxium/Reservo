import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantScalarFieldEnumSchema } from "./enums/TenantScalarFieldEnum.schema";
import { TenantIncludeObjectSchema } from "./objects/TenantInclude.schema";
import { TenantOrderByWithRelationInputObjectSchema } from "./objects/TenantOrderByWithRelationInput.schema";
import { TenantWhereInputObjectSchema } from "./objects/TenantWhereInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./objects/TenantWhereUniqueInput.schema";

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TenantFindFirstOrThrowSelectSchema: z.ZodType<Prisma.TenantSelect> =
  z
    .object({
      id: z.boolean().optional(),
      name: z.boolean().optional(),
      displayName: z.boolean().optional(),
      description: z.boolean().optional(),
      email: z.boolean().optional(),
      phone: z.boolean().optional(),
      address: z.boolean().optional(),
      city: z.boolean().optional(),
      country: z.boolean().optional(),
      website: z.boolean().optional(),
      facebookUrl: z.boolean().optional(),
      twitterUrl: z.boolean().optional(),
      instagramUrl: z.boolean().optional(),
      linkedinUrl: z.boolean().optional(),
      youtubeUrl: z.boolean().optional(),
      foundedYear: z.boolean().optional(),
      logoUrl: z.boolean().optional(),
      faviconUrl: z.boolean().optional(),
      metaTitle: z.boolean().optional(),
      metaDescription: z.boolean().optional(),
      metaKeywords: z.boolean().optional(),
      termsUrl: z.boolean().optional(),
      privacyUrl: z.boolean().optional(),
      cookiesUrl: z.boolean().optional(),
      complaintsUrl: z.boolean().optional(),
      isActive: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      updatedAt: z.boolean().optional(),
      users: z.boolean().optional(),
      permissions: z.boolean().optional(),
      roles: z.boolean().optional(),
      translations: z.boolean().optional(),
      _count: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TenantSelect>;

export const TenantFindFirstOrThrowSelectZodSchema = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    displayName: z.boolean().optional(),
    description: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
    address: z.boolean().optional(),
    city: z.boolean().optional(),
    country: z.boolean().optional(),
    website: z.boolean().optional(),
    facebookUrl: z.boolean().optional(),
    twitterUrl: z.boolean().optional(),
    instagramUrl: z.boolean().optional(),
    linkedinUrl: z.boolean().optional(),
    youtubeUrl: z.boolean().optional(),
    foundedYear: z.boolean().optional(),
    logoUrl: z.boolean().optional(),
    faviconUrl: z.boolean().optional(),
    metaTitle: z.boolean().optional(),
    metaDescription: z.boolean().optional(),
    metaKeywords: z.boolean().optional(),
    termsUrl: z.boolean().optional(),
    privacyUrl: z.boolean().optional(),
    cookiesUrl: z.boolean().optional(),
    complaintsUrl: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    users: z.boolean().optional(),
    permissions: z.boolean().optional(),
    roles: z.boolean().optional(),
    translations: z.boolean().optional(),
    _count: z.boolean().optional(),
  })
  .strict();

export const TenantFindFirstOrThrowSchema: z.ZodType<Prisma.TenantFindFirstOrThrowArgs> =
  z
    .object({
      select: TenantFindFirstOrThrowSelectSchema.optional(),
      include: TenantIncludeObjectSchema.optional(),
      orderBy: z
        .union([
          TenantOrderByWithRelationInputObjectSchema,
          TenantOrderByWithRelationInputObjectSchema.array(),
        ])
        .optional(),
      where: TenantWhereInputObjectSchema.optional(),
      cursor: TenantWhereUniqueInputObjectSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          TenantScalarFieldEnumSchema,
          TenantScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TenantFindFirstOrThrowArgs>;

export const TenantFindFirstOrThrowZodSchema = z
  .object({
    select: TenantFindFirstOrThrowSelectSchema.optional(),
    include: TenantIncludeObjectSchema.optional(),
    orderBy: z
      .union([
        TenantOrderByWithRelationInputObjectSchema,
        TenantOrderByWithRelationInputObjectSchema.array(),
      ])
      .optional(),
    where: TenantWhereInputObjectSchema.optional(),
    cursor: TenantWhereUniqueInputObjectSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([TenantScalarFieldEnumSchema, TenantScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();
