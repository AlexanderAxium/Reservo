import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TranslationScalarWhereInputObjectSchema } from "./TranslationScalarWhereInput.schema";
import { TranslationUncheckedUpdateManyWithoutTenantInputObjectSchema } from "./TranslationUncheckedUpdateManyWithoutTenantInput.schema";
import { TranslationUpdateManyMutationInputObjectSchema } from "./TranslationUpdateManyMutationInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => TranslationScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => TranslationUpdateManyMutationInputObjectSchema),
        z.lazy(
          () => TranslationUncheckedUpdateManyWithoutTenantInputObjectSchema
        ),
      ]),
    })
    .strict();
export const TranslationUpdateManyWithWhereWithoutTenantInputObjectSchema: z.ZodType<Prisma.TranslationUpdateManyWithWhereWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.TranslationUpdateManyWithWhereWithoutTenantInput>;
export const TranslationUpdateManyWithWhereWithoutTenantInputObjectZodSchema =
  makeSchema();
