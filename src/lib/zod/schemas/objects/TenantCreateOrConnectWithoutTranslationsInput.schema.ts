import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantCreateWithoutTranslationsInputObjectSchema } from "./TenantCreateWithoutTranslationsInput.schema";
import { TenantUncheckedCreateWithoutTranslationsInputObjectSchema } from "./TenantUncheckedCreateWithoutTranslationsInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./TenantWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TenantWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => TenantCreateWithoutTranslationsInputObjectSchema),
        z.lazy(() => TenantUncheckedCreateWithoutTranslationsInputObjectSchema),
      ]),
    })
    .strict();
export const TenantCreateOrConnectWithoutTranslationsInputObjectSchema: z.ZodType<Prisma.TenantCreateOrConnectWithoutTranslationsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantCreateOrConnectWithoutTranslationsInput>;
export const TenantCreateOrConnectWithoutTranslationsInputObjectZodSchema =
  makeSchema();
