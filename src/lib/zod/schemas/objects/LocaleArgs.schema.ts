import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleIncludeObjectSchema } from "./LocaleInclude.schema";
import { LocaleSelectObjectSchema } from "./LocaleSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z.lazy(() => LocaleSelectObjectSchema).optional(),
      include: z.lazy(() => LocaleIncludeObjectSchema).optional(),
    })
    .strict();
export const LocaleArgsObjectSchema = makeSchema();
export const LocaleArgsObjectZodSchema = makeSchema();
