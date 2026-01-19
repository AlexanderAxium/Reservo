import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LanguageSchema } from "../enums/Language.schema";
import { ThemeSchema } from "../enums/Theme.schema";
import { AccountCreateNestedManyWithoutUserInputObjectSchema } from "./AccountCreateNestedManyWithoutUserInput.schema";
import { SessionCreateNestedManyWithoutUserInputObjectSchema } from "./SessionCreateNestedManyWithoutUserInput.schema";
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
      phone: z.string().optional().nullable(),
      language: LanguageSchema.optional(),
      theme: ThemeSchema.optional(),
      accounts: z.lazy(
        () => AccountCreateNestedManyWithoutUserInputObjectSchema
      ),
      sessions: z.lazy(
        () => SessionCreateNestedManyWithoutUserInputObjectSchema
      ),
      tenant: z
        .lazy(() => TenantCreateNestedOneWithoutUsersInputObjectSchema)
        .optional(),
      userRoles: z.lazy(
        () => UserRoleCreateNestedManyWithoutUserInputObjectSchema
      ),
    })
    .strict();
export const UserCreateInputObjectSchema: z.ZodType<Prisma.UserCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateInput>;
export const UserCreateInputObjectZodSchema = makeSchema();
