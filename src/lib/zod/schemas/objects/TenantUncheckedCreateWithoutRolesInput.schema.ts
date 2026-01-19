import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionUncheckedCreateNestedManyWithoutTenantInputObjectSchema } from "./PermissionUncheckedCreateNestedManyWithoutTenantInput.schema";
import { TranslationUncheckedCreateNestedManyWithoutTenantInputObjectSchema } from "./TranslationUncheckedCreateNestedManyWithoutTenantInput.schema";
import { UserUncheckedCreateNestedManyWithoutTenantInputObjectSchema } from "./UserUncheckedCreateNestedManyWithoutTenantInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      displayName: z.string().optional(),
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
      isActive: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      users: z
        .lazy(() => UserUncheckedCreateNestedManyWithoutTenantInputObjectSchema)
        .optional(),
      permissions: z
        .lazy(
          () =>
            PermissionUncheckedCreateNestedManyWithoutTenantInputObjectSchema
        )
        .optional(),
      translations: z
        .lazy(
          () =>
            TranslationUncheckedCreateNestedManyWithoutTenantInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const TenantUncheckedCreateWithoutRolesInputObjectSchema: z.ZodType<Prisma.TenantUncheckedCreateWithoutRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantUncheckedCreateWithoutRolesInput>;
export const TenantUncheckedCreateWithoutRolesInputObjectZodSchema =
  makeSchema();
