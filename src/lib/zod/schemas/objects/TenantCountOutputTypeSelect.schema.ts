import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCountOutputTypeCountPermissionsArgsObjectSchema } from "./TenantCountOutputTypeCountPermissionsArgs.schema";
import { TenantCountOutputTypeCountRolesArgsObjectSchema } from "./TenantCountOutputTypeCountRolesArgs.schema";
import { TenantCountOutputTypeCountTranslationsArgsObjectSchema } from "./TenantCountOutputTypeCountTranslationsArgs.schema";
import { TenantCountOutputTypeCountUsersArgsObjectSchema } from "./TenantCountOutputTypeCountUsersArgs.schema";

const makeSchema = () =>
  z
    .object({
      users: z
        .union([
          z.boolean(),
          z.lazy(() => TenantCountOutputTypeCountUsersArgsObjectSchema),
        ])
        .optional(),
      permissions: z
        .union([
          z.boolean(),
          z.lazy(() => TenantCountOutputTypeCountPermissionsArgsObjectSchema),
        ])
        .optional(),
      roles: z
        .union([
          z.boolean(),
          z.lazy(() => TenantCountOutputTypeCountRolesArgsObjectSchema),
        ])
        .optional(),
      translations: z
        .union([
          z.boolean(),
          z.lazy(() => TenantCountOutputTypeCountTranslationsArgsObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const TenantCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TenantCountOutputTypeSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantCountOutputTypeSelect>;
export const TenantCountOutputTypeSelectObjectZodSchema = makeSchema();
