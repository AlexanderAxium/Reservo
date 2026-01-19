import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { LocaleCountOutputTypeSelectObjectSchema } from "./LocaleCountOutputTypeSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z.lazy(() => LocaleCountOutputTypeSelectObjectSchema).optional(),
    })
    .strict();
export const LocaleCountOutputTypeArgsObjectSchema = makeSchema();
export const LocaleCountOutputTypeArgsObjectZodSchema = makeSchema();
