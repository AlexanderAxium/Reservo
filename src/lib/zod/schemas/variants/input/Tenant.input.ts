import * as z from "zod";
// prettier-ignore
export const TenantInputSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    description: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    facebookUrl: z.string().optional().nullable(),
    twitterUrl: z.string().optional().nullable(),
    instagramUrl: z.string().optional().nullable(),
    linkedinUrl: z.string().optional().nullable(),
    youtubeUrl: z.string().optional().nullable(),
    foundedYear: z.number().int().optional().nullable(),
    logoUrl: z.string().optional().nullable(),
    faviconUrl: z.string().optional().nullable(),
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    metaKeywords: z.string().optional().nullable(),
    termsUrl: z.string().optional().nullable(),
    privacyUrl: z.string().optional().nullable(),
    cookiesUrl: z.string().optional().nullable(),
    complaintsUrl: z.string().optional().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    users: z.array(z.unknown()),
    permissions: z.array(z.unknown()),
    roles: z.array(z.unknown()),
    translations: z.array(z.unknown()),
  })
  .strict();

export type TenantInputType = z.infer<typeof TenantInputSchema>;
