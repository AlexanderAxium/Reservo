import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleWhereInputObjectSchema } from "./LocaleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      is: z.lazy(() => LocaleWhereInputObjectSchema).optional(),
      isNot: z.lazy(() => LocaleWhereInputObjectSchema).optional(),
    })
    .strict();
export const LocaleScalarRelationFilterObjectSchema: z.ZodType<Prisma.LocaleScalarRelationFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.LocaleScalarRelationFilter>;
export const LocaleScalarRelationFilterObjectZodSchema = makeSchema();
