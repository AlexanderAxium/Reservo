import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationCreateManyTenantInputObjectSchema } from "./TranslationCreateManyTenantInput.schema";

const makeSchema = () =>
  z
    .object({
      data: z.union([
        z.lazy(() => TranslationCreateManyTenantInputObjectSchema),
        z.lazy(() => TranslationCreateManyTenantInputObjectSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();
export const TranslationCreateManyTenantInputEnvelopeObjectSchema: z.ZodType<Prisma.TranslationCreateManyTenantInputEnvelope> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationCreateManyTenantInputEnvelope>;
export const TranslationCreateManyTenantInputEnvelopeObjectZodSchema =
  makeSchema();
