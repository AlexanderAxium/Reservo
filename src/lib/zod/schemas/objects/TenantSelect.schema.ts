import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionFindManySchema } from "../findManyPermission.schema";
import { RoleFindManySchema } from "../findManyRole.schema";
import { TranslationFindManySchema } from "../findManyTranslation.schema";
import { UserFindManySchema } from "../findManyUser.schema";
import { TenantCountOutputTypeArgsObjectSchema } from "./TenantCountOutputTypeArgs.schema";

const makeSchema = () =>
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
      users: z
        .union([z.boolean(), z.lazy(() => UserFindManySchema)])
        .optional(),
      permissions: z
        .union([z.boolean(), z.lazy(() => PermissionFindManySchema)])
        .optional(),
      roles: z
        .union([z.boolean(), z.lazy(() => RoleFindManySchema)])
        .optional(),
      translations: z
        .union([z.boolean(), z.lazy(() => TranslationFindManySchema)])
        .optional(),
      _count: z
        .union([
          z.boolean(),
          z.lazy(() => TenantCountOutputTypeArgsObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const TenantSelectObjectSchema: z.ZodType<Prisma.TenantSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantSelect>;
export const TenantSelectObjectZodSchema = makeSchema();
