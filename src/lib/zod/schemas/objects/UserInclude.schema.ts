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
export const UserIncludeObjectSchema: z.ZodType<Prisma.UserInclude> =
  makeSchema() as unknown as z.ZodType<Prisma.UserInclude>;
export const UserIncludeObjectZodSchema = makeSchema();
