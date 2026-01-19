import * as z from "zod";

export const TenantScalarFieldEnumSchema = z.enum([
  "id",
  "name",
  "displayName",
  "description",
  "email",
  "phone",
  "address",
  "city",
  "country",
  "website",
  "facebookUrl",
  "twitterUrl",
  "instagramUrl",
  "linkedinUrl",
  "youtubeUrl",
  "foundedYear",
  "logoUrl",
  "faviconUrl",
  "metaTitle",
  "metaDescription",
  "metaKeywords",
  "termsUrl",
  "privacyUrl",
  "cookiesUrl",
  "complaintsUrl",
  "isActive",
  "createdAt",
  "updatedAt",
]);

export type TenantScalarFieldEnum = z.infer<typeof TenantScalarFieldEnumSchema>;
