import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCreateOrConnectWithoutTranslationsInputObjectSchema } from "./TenantCreateOrConnectWithoutTranslationsInput.schema";
import { TenantCreateWithoutTranslationsInputObjectSchema } from "./TenantCreateWithoutTranslationsInput.schema";
import { TenantUncheckedCreateWithoutTranslationsInputObjectSchema } from "./TenantUncheckedCreateWithoutTranslationsInput.schema";
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
      connect: z.lazy(() => TenantWhereUniqueInputObjectSchema).optional(),
    })
    .strict();
export const TenantCreateNestedOneWithoutTranslationsInputObjectSchema: z.ZodType<Prisma.TenantCreateNestedOneWithoutTranslationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantCreateNestedOneWithoutTranslationsInput>;
export const TenantCreateNestedOneWithoutTranslationsInputObjectZodSchema =
  makeSchema();
