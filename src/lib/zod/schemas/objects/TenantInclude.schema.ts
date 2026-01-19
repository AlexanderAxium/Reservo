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
export const TenantIncludeObjectSchema: z.ZodType<Prisma.TenantInclude> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantInclude>;
export const TenantIncludeObjectZodSchema = makeSchema();
