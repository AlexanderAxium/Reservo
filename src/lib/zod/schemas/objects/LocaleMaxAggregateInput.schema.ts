import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.literal(true).optional(),
      languageCode: z.literal(true).optional(),
      name: z.literal(true).optional(),
      nativeName: z.literal(true).optional(),
      locale: z.literal(true).optional(),
      direction: z.literal(true).optional(),
      currencySymbol: z.literal(true).optional(),
      isActive: z.literal(true).optional(),
      isDefault: z.literal(true).optional(),
      flagUrl: z.literal(true).optional(),
      displayOrder: z.literal(true).optional(),
      createdAt: z.literal(true).optional(),
      updatedAt: z.literal(true).optional(),
    })
    .strict();
export const LocaleMaxAggregateInputObjectSchema: z.ZodType<Prisma.LocaleMaxAggregateInputType> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleMaxAggregateInputType>;
export const LocaleMaxAggregateInputObjectZodSchema = makeSchema();
