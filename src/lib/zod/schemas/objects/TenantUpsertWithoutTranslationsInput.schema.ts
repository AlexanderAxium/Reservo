import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCreateWithoutTranslationsInputObjectSchema } from "./TenantCreateWithoutTranslationsInput.schema";
import { TenantUncheckedCreateWithoutTranslationsInputObjectSchema } from "./TenantUncheckedCreateWithoutTranslationsInput.schema";
import { TenantUncheckedUpdateWithoutTranslationsInputObjectSchema } from "./TenantUncheckedUpdateWithoutTranslationsInput.schema";
import { TenantUpdateWithoutTranslationsInputObjectSchema } from "./TenantUpdateWithoutTranslationsInput.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      update: z.union([
        z.lazy(() => TenantUpdateWithoutTranslationsInputObjectSchema),
        z.lazy(() => TenantUncheckedUpdateWithoutTranslationsInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => TenantCreateWithoutTranslationsInputObjectSchema),
        z.lazy(() => TenantUncheckedCreateWithoutTranslationsInputObjectSchema),
      ]),
      where: z.lazy(() => TenantWhereInputObjectSchema).optional(),
    })
    .strict();
export const TenantUpsertWithoutTranslationsInputObjectSchema: z.ZodType<Prisma.TenantUpsertWithoutTranslationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantUpsertWithoutTranslationsInput>;
export const TenantUpsertWithoutTranslationsInputObjectZodSchema = makeSchema();
