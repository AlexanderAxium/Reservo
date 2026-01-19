import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationFindManySchema } from "../findManyTranslation.schema";
import { LocaleCountOutputTypeArgsObjectSchema } from "./LocaleCountOutputTypeArgs.schema";

const makeSchema = () =>
  z
    .object({
      translations: z
        .union([z.boolean(), z.lazy(() => TranslationFindManySchema)])
        .optional(),
      _count: z
        .union([
          z.boolean(),
          z.lazy(() => LocaleCountOutputTypeArgsObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const LocaleIncludeObjectSchema: z.ZodType<Prisma.LocaleInclude> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleInclude>;
export const LocaleIncludeObjectZodSchema = makeSchema();
