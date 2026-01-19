import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantUncheckedUpdateWithoutTranslationsInputObjectSchema } from "./TenantUncheckedUpdateWithoutTranslationsInput.schema";
import { TenantUpdateWithoutTranslationsInputObjectSchema } from "./TenantUpdateWithoutTranslationsInput.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TenantWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => TenantUpdateWithoutTranslationsInputObjectSchema),
        z.lazy(() => TenantUncheckedUpdateWithoutTranslationsInputObjectSchema),
      ]),
    })
    .strict();
export const TenantUpdateToOneWithWhereWithoutTranslationsInputObjectSchema: z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutTranslationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutTranslationsInput>;
export const TenantUpdateToOneWithWhereWithoutTranslationsInputObjectZodSchema =
  makeSchema();
