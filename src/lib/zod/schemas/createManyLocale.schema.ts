import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { LocaleCreateManyInputObjectSchema } from "./objects/LocaleCreateManyInput.schema";

export const LocaleCreateManySchema: z.ZodType<Prisma.LocaleCreateManyArgs> = z
  .object({
    data: z.union([
      LocaleCreateManyInputObjectSchema,
      z.array(LocaleCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.LocaleCreateManyArgs>;

export const LocaleCreateManyZodSchema = z
  .object({
    data: z.union([
      LocaleCreateManyInputObjectSchema,
      z.array(LocaleCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
