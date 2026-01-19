import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LanguageSchema } from "../enums/Language.schema";
import { ThemeSchema } from "../enums/Theme.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      name: z.string(),
      email: z.string(),
      emailVerified: z.boolean().optional(),
      image: z.string().optional().nullable(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      phone: z.string().optional().nullable(),
      language: LanguageSchema.optional(),
      theme: ThemeSchema.optional(),
    })
    .strict();
export const UserCreateManyTenantInputObjectSchema: z.ZodType<Prisma.UserCreateManyTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateManyTenantInput>;
export const UserCreateManyTenantInputObjectZodSchema = makeSchema();
