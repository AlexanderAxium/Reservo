import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleArgsObjectSchema } from "./LocaleArgs.schema";
import { TenantArgsObjectSchema } from "./TenantArgs.schema";

const makeSchema = () =>
  z
    .object({
      locale: z
        .union([z.boolean(), z.lazy(() => LocaleArgsObjectSchema)])
        .optional(),
      tenant: z
        .union([z.boolean(), z.lazy(() => TenantArgsObjectSchema)])
        .optional(),
    })
    .strict();
export const TranslationIncludeObjectSchema: z.ZodType<Prisma.TranslationInclude> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationInclude>;
export const TranslationIncludeObjectZodSchema = makeSchema();
