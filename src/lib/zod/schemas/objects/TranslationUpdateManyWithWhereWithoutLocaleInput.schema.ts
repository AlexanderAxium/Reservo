import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationScalarWhereInputObjectSchema } from "./TranslationScalarWhereInput.schema";
import { TranslationUncheckedUpdateManyWithoutLocaleInputObjectSchema } from "./TranslationUncheckedUpdateManyWithoutLocaleInput.schema";
import { TranslationUpdateManyMutationInputObjectSchema } from "./TranslationUpdateManyMutationInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TranslationScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => TranslationUpdateManyMutationInputObjectSchema),
        z.lazy(
          () => TranslationUncheckedUpdateManyWithoutLocaleInputObjectSchema
        ),
      ]),
    })
    .strict();
export const TranslationUpdateManyWithWhereWithoutLocaleInputObjectSchema: z.ZodType<Prisma.TranslationUpdateManyWithWhereWithoutLocaleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationUpdateManyWithWhereWithoutLocaleInput>;
export const TranslationUpdateManyWithWhereWithoutLocaleInputObjectZodSchema =
  makeSchema();
