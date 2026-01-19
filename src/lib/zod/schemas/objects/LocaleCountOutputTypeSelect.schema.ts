import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleCountOutputTypeCountTranslationsArgsObjectSchema } from "./LocaleCountOutputTypeCountTranslationsArgs.schema";

const makeSchema = () =>
  z
    .object({
      translations: z
        .union([
          z.boolean(),
          z.lazy(() => LocaleCountOutputTypeCountTranslationsArgsObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const LocaleCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.LocaleCountOutputTypeSelect> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleCountOutputTypeSelect>;
export const LocaleCountOutputTypeSelectObjectZodSchema = makeSchema();
