import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { SortOrderSchema } from "../enums/SortOrder.schema";
import { SortOrderInputObjectSchema } from "./SortOrderInput.schema";
import { TenantAvgOrderByAggregateInputObjectSchema } from "./TenantAvgOrderByAggregateInput.schema";
import { TenantCountOrderByAggregateInputObjectSchema } from "./TenantCountOrderByAggregateInput.schema";
import { TenantMaxOrderByAggregateInputObjectSchema } from "./TenantMaxOrderByAggregateInput.schema";
import { TenantMinOrderByAggregateInputObjectSchema } from "./TenantMinOrderByAggregateInput.schema";
import { TenantSumOrderByAggregateInputObjectSchema } from "./TenantSumOrderByAggregateInput.schema";

const makeSchema = () =>
  z
    .object({
      id: SortOrderSchema.optional(),
      name: SortOrderSchema.optional(),
      displayName: SortOrderSchema.optional(),
      description: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      email: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      phone: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      address: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      city: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      country: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      website: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      facebookUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      twitterUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      instagramUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      linkedinUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      youtubeUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      foundedYear: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      logoUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      faviconUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      metaTitle: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      metaDescription: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      metaKeywords: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      termsUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      privacyUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      cookiesUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      complaintsUrl: z
        .union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)])
        .optional(),
      isActive: SortOrderSchema.optional(),
      createdAt: SortOrderSchema.optional(),
      updatedAt: SortOrderSchema.optional(),
      _count: z
        .lazy(() => TenantCountOrderByAggregateInputObjectSchema)
        .optional(),
      _avg: z.lazy(() => TenantAvgOrderByAggregateInputObjectSchema).optional(),
      _max: z.lazy(() => TenantMaxOrderByAggregateInputObjectSchema).optional(),
      _min: z.lazy(() => TenantMinOrderByAggregateInputObjectSchema).optional(),
      _sum: z.lazy(() => TenantSumOrderByAggregateInputObjectSchema).optional(),
    })
    .strict();
export const TenantOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TenantOrderByWithAggregationInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantOrderByWithAggregationInput>;
export const TenantOrderByWithAggregationInputObjectZodSchema = makeSchema();
