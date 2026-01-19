import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.literal(true).optional(),
      name: z.literal(true).optional(),
      displayName: z.literal(true).optional(),
      description: z.literal(true).optional(),
      email: z.literal(true).optional(),
      phone: z.literal(true).optional(),
      address: z.literal(true).optional(),
      city: z.literal(true).optional(),
      country: z.literal(true).optional(),
      website: z.literal(true).optional(),
      facebookUrl: z.literal(true).optional(),
      twitterUrl: z.literal(true).optional(),
      instagramUrl: z.literal(true).optional(),
      linkedinUrl: z.literal(true).optional(),
      youtubeUrl: z.literal(true).optional(),
      foundedYear: z.literal(true).optional(),
      logoUrl: z.literal(true).optional(),
      faviconUrl: z.literal(true).optional(),
      metaTitle: z.literal(true).optional(),
      metaDescription: z.literal(true).optional(),
      metaKeywords: z.literal(true).optional(),
      termsUrl: z.literal(true).optional(),
      privacyUrl: z.literal(true).optional(),
      cookiesUrl: z.literal(true).optional(),
      complaintsUrl: z.literal(true).optional(),
      isActive: z.literal(true).optional(),
      createdAt: z.literal(true).optional(),
      updatedAt: z.literal(true).optional(),
    })
    .strict();
export const TenantMinAggregateInputObjectSchema: z.ZodType<Prisma.TenantMinAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantMinAggregateInputType>;
export const TenantMinAggregateInputObjectZodSchema = makeSchema();
