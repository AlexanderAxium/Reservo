import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationIncludeObjectSchema } from "./TranslationInclude.schema";
import { TranslationSelectObjectSchema } from "./TranslationSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z.lazy(() => TranslationSelectObjectSchema).optional(),
      include: z.lazy(() => TranslationIncludeObjectSchema).optional(),
    })
    .strict();
export const TranslationArgsObjectSchema = makeSchema();
export const TranslationArgsObjectZodSchema = makeSchema();
