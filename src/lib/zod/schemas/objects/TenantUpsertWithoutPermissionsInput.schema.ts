import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCreateWithoutPermissionsInputObjectSchema } from "./TenantCreateWithoutPermissionsInput.schema";
import { TenantUncheckedCreateWithoutPermissionsInputObjectSchema } from "./TenantUncheckedCreateWithoutPermissionsInput.schema";
import { TenantUncheckedUpdateWithoutPermissionsInputObjectSchema } from "./TenantUncheckedUpdateWithoutPermissionsInput.schema";
import { TenantUpdateWithoutPermissionsInputObjectSchema } from "./TenantUpdateWithoutPermissionsInput.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      update: z.union([
        z.lazy(() => TenantUpdateWithoutPermissionsInputObjectSchema),
        z.lazy(() => TenantUncheckedUpdateWithoutPermissionsInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => TenantCreateWithoutPermissionsInputObjectSchema),
        z.lazy(() => TenantUncheckedCreateWithoutPermissionsInputObjectSchema),
      ]),
      where: z.lazy(() => TenantWhereInputObjectSchema).optional(),
    })
    .strict();
export const TenantUpsertWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.TenantUpsertWithoutPermissionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantUpsertWithoutPermissionsInput>;
export const TenantUpsertWithoutPermissionsInputObjectZodSchema = makeSchema();
