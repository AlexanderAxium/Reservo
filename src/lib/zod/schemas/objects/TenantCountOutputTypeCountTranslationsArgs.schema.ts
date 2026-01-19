import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationWhereInputObjectSchema } from "./TranslationWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TranslationWhereInputObjectSchema).optional(),
    })
    .strict();
export const TenantCountOutputTypeCountTranslationsArgsObjectSchema =
  makeSchema();
export const TenantCountOutputTypeCountTranslationsArgsObjectZodSchema =
  makeSchema();
