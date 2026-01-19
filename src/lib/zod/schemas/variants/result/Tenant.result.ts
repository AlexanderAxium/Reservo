import * as z from "zod";
// prettier-ignore
export const TenantResultSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    description: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    website: z.string().nullable(),
    facebookUrl: z.string().nullable(),
    twitterUrl: z.string().nullable(),
    instagramUrl: z.string().nullable(),
    linkedinUrl: z.string().nullable(),
    youtubeUrl: z.string().nullable(),
    foundedYear: z.number().int().nullable(),
    logoUrl: z.string().nullable(),
    faviconUrl: z.string().nullable(),
    metaTitle: z.string().nullable(),
    metaDescription: z.string().nullable(),
    metaKeywords: z.string().nullable(),
    termsUrl: z.string().nullable(),
    privacyUrl: z.string().nullable(),
    cookiesUrl: z.string().nullable(),
    complaintsUrl: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    users: z.array(z.unknown()),
    permissions: z.array(z.unknown()),
    roles: z.array(z.unknown()),
    translations: z.array(z.unknown()),
  })
  .strict();

export type TenantResultType = z.infer<typeof TenantResultSchema>;
