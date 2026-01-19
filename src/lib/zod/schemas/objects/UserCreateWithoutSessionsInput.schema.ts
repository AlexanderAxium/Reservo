import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LanguageSchema } from "../enums/Language.schema";
import { ThemeSchema } from "../enums/Theme.schema";
import { AccountCreateNestedManyWithoutUserInputObjectSchema } from "./AccountCreateNestedManyWithoutUserInput.schema";
import { TenantCreateNestedOneWithoutUsersInputObjectSchema } from "./TenantCreateNestedOneWithoutUsersInput.schema";
import { UserRoleCreateNestedManyWithoutUserInputObjectSchema } from "./UserRoleCreateNestedManyWithoutUserInput.schema";

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
      tenant: z
        .lazy(() => TenantCreateNestedOneWithoutUsersInputObjectSchema)
        .optional(),
      userRoles: z
        .lazy(() => UserRoleCreateNestedManyWithoutUserInputObjectSchema)
        .optional(),
    })
    .strict();
export const UserCreateWithoutSessionsInputObjectSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateWithoutSessionsInput>;
export const UserCreateWithoutSessionsInputObjectZodSchema = makeSchema();
