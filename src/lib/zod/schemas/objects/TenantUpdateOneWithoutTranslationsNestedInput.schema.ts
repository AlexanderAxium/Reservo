import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCreateOrConnectWithoutTranslationsInputObjectSchema } from "./TenantCreateOrConnectWithoutTranslationsInput.schema";
import { TenantCreateWithoutTranslationsInputObjectSchema } from "./TenantCreateWithoutTranslationsInput.schema";
import { TenantUncheckedCreateWithoutTranslationsInputObjectSchema } from "./TenantUncheckedCreateWithoutTranslationsInput.schema";
import { TenantUncheckedUpdateWithoutTranslationsInputObjectSchema } from "./TenantUncheckedUpdateWithoutTranslationsInput.schema";
import { TenantUpdateToOneWithWhereWithoutTranslationsInputObjectSchema } from "./TenantUpdateToOneWithWhereWithoutTranslationsInput.schema";
import { TenantUpdateWithoutTranslationsInputObjectSchema } from "./TenantUpdateWithoutTranslationsInput.schema";
import { TenantUpsertWithoutTranslationsInputObjectSchema } from "./TenantUpsertWithoutTranslationsInput.schema";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./TenantWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => TenantCreateWithoutTranslationsInputObjectSchema),
          z.lazy(
            () => TenantUncheckedCreateWithoutTranslationsInputObjectSchema
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => TenantCreateOrConnectWithoutTranslationsInputObjectSchema)
        .optional(),
      upsert: z
        .lazy(() => TenantUpsertWithoutTranslationsInputObjectSchema)
        .optional(),
      disconnect: z
        .union([z.boolean(), z.lazy(() => TenantWhereInputObjectSchema)])
        .optional(),
      delete: z
        .union([z.boolean(), z.lazy(() => TenantWhereInputObjectSchema)])
        .optional(),
      connect: z.lazy(() => TenantWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => TenantUpdateToOneWithWhereWithoutTranslationsInputObjectSchema
          ),
          z.lazy(() => TenantUpdateWithoutTranslationsInputObjectSchema),
          z.lazy(
            () => TenantUncheckedUpdateWithoutTranslationsInputObjectSchema
          ),
        ])
        .optional(),
    })
    .strict();
export const TenantUpdateOneWithoutTranslationsNestedInputObjectSchema: z.ZodType<Prisma.TenantUpdateOneWithoutTranslationsNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantUpdateOneWithoutTranslationsNestedInput>;
export const TenantUpdateOneWithoutTranslationsNestedInputObjectZodSchema =
  makeSchema();
