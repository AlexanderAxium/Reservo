import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { AccountFindManySchema } from "../findManyAccount.schema";
import { SessionFindManySchema } from "../findManySession.schema";
import { UserRoleFindManySchema } from "../findManyUserRole.schema";
import { TenantArgsObjectSchema } from "./TenantArgs.schema";
import { UserCountOutputTypeArgsObjectSchema } from "./UserCountOutputTypeArgs.schema";

const makeSchema = () =>
  z
    .object({
      id: z.boolean().optional(),
      name: z.boolean().optional(),
      email: z.boolean().optional(),
      emailVerified: z.boolean().optional(),
      image: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      updatedAt: z.boolean().optional(),
      phone: z.boolean().optional(),
      language: z.boolean().optional(),
      theme: z.boolean().optional(),
      tenantId: z.boolean().optional(),
      accounts: z
        .union([z.boolean(), z.lazy(() => AccountFindManySchema)])
        .optional(),
      sessions: z
        .union([z.boolean(), z.lazy(() => SessionFindManySchema)])
        .optional(),
      tenant: z
        .union([z.boolean(), z.lazy(() => TenantArgsObjectSchema)])
        .optional(),
      userRoles: z
        .union([z.boolean(), z.lazy(() => UserRoleFindManySchema)])
        .optional(),
      _count: z
        .union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)])
        .optional(),
    })
    .strict();
export const UserSelectObjectSchema: z.ZodType<Prisma.UserSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.UserSelect>;
export const UserSelectObjectZodSchema = makeSchema();
