import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      name: SortOrderSchema.optional(),
      displayName: SortOrderSchema.optional(),
      description: SortOrderSchema.optional(),
      email: SortOrderSchema.optional(),
      phone: SortOrderSchema.optional(),
      address: SortOrderSchema.optional(),
      city: SortOrderSchema.optional(),
      country: SortOrderSchema.optional(),
      website: SortOrderSchema.optional(),
      facebookUrl: SortOrderSchema.optional(),
      twitterUrl: SortOrderSchema.optional(),
      instagramUrl: SortOrderSchema.optional(),
      linkedinUrl: SortOrderSchema.optional(),
      youtubeUrl: SortOrderSchema.optional(),
      foundedYear: SortOrderSchema.optional(),
      logoUrl: SortOrderSchema.optional(),
      faviconUrl: SortOrderSchema.optional(),
      metaTitle: SortOrderSchema.optional(),
      metaDescription: SortOrderSchema.optional(),
      metaKeywords: SortOrderSchema.optional(),
      termsUrl: SortOrderSchema.optional(),
      privacyUrl: SortOrderSchema.optional(),
      cookiesUrl: SortOrderSchema.optional(),
      complaintsUrl: SortOrderSchema.optional(),
      isActive: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
    })
    .strict();
export const TenantMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TenantMinOrderByAggregateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantMinOrderByAggregateInput>;
export const TenantMinOrderByAggregateInputObjectZodSchema = makeSchema();
