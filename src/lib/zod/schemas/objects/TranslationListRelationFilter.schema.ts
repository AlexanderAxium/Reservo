import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationWhereInputObjectSchema } from "./TranslationWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      every: z.lazy(() => TranslationWhereInputObjectSchema).optional(),
      some: z.lazy(() => TranslationWhereInputObjectSchema).optional(),
      none: z.lazy(() => TranslationWhereInputObjectSchema).optional(),
    })
    .strict();
export const TranslationListRelationFilterObjectSchema: z.ZodType<Prisma.TranslationListRelationFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationListRelationFilter>;
export const TranslationListRelationFilterObjectZodSchema = makeSchema();
