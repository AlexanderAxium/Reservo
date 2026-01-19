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
      tenantId: z.string().optional().nullable(),
    })
    .strict();
export const UserCreateManyInputObjectSchema: z.ZodType<Prisma.UserCreateManyInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateManyInput>;
export const UserCreateManyInputObjectZodSchema = makeSchema();
