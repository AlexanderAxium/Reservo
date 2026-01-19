import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateManyLocaleInputObjectSchema } from "./TranslationCreateManyLocaleInput.schema";

const makeSchema = () =>
  z
    .object({
      data: z.union([
        z.lazy(() => TranslationCreateManyLocaleInputObjectSchema),
        z.lazy(() => TranslationCreateManyLocaleInputObjectSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();
export const TranslationCreateManyLocaleInputEnvelopeObjectSchema: z.ZodType<Prisma.TranslationCreateManyLocaleInputEnvelope> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationCreateManyLocaleInputEnvelope>;
export const TranslationCreateManyLocaleInputEnvelopeObjectZodSchema =
  makeSchema();
