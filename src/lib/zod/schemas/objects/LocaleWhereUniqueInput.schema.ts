import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      languageCode: z.string().optional(),
    })
    .strict();
export const LocaleWhereUniqueInputObjectSchema: z.ZodType<Prisma.LocaleWhereUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleWhereUniqueInput>;
export const LocaleWhereUniqueInputObjectZodSchema = makeSchema();
