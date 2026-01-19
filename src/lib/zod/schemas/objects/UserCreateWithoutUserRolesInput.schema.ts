import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LanguageSchema } from "../enums/Language.schema";
import { ThemeSchema } from "../enums/Theme.schema";
import { AccountCreateNestedManyWithoutUserInputObjectSchema } from "./AccountCreateNestedManyWithoutUserInput.schema";
import { SessionCreateNestedManyWithoutUserInputObjectSchema } from "./SessionCreateNestedManyWithoutUserInput.schema";
import { TenantCreateNestedOneWithoutUsersInputObjectSchema } from "./TenantCreateNestedOneWithoutUsersInput.schema";

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
      accounts: z
        .lazy(() => AccountCreateNestedManyWithoutUserInputObjectSchema)
        .optional(),
      sessions: z
        .lazy(() => SessionCreateNestedManyWithoutUserInputObjectSchema)
        .optional(),
      tenant: z
        .lazy(() => TenantCreateNestedOneWithoutUsersInputObjectSchema)
        .optional(),
    })
    .strict();
export const UserCreateWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutUserRolesInput>;
export const UserCreateWithoutUserRolesInputObjectZodSchema = makeSchema();
