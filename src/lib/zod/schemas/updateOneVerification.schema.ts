import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationSelectObjectSchema } from "./objects/VerificationSelect.schema";
import { VerificationUncheckedUpdateInputObjectSchema } from "./objects/VerificationUncheckedUpdateInput.schema";
import { VerificationUpdateInputObjectSchema } from "./objects/VerificationUpdateInput.schema";
import { VerificationWhereUniqueInputObjectSchema } from "./objects/VerificationWhereUniqueInput.schema";

export const VerificationUpdateOneSchema: z.ZodType<Prisma.VerificationUpdateArgs> =
  z
    .object({
      select: VerificationSelectObjectSchema.optional(),
      data: z.union([
        VerificationUpdateInputObjectSchema,
        VerificationUncheckedUpdateInputObjectSchema,
      ]),
      where: VerificationWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationUpdateArgs>;

export const VerificationUpdateOneZodSchema = z
  .object({
    select: VerificationSelectObjectSchema.optional(),
    data: z.union([
      VerificationUpdateInputObjectSchema,
      VerificationUncheckedUpdateInputObjectSchema,
    ]),
    where: VerificationWhereUniqueInputObjectSchema,
  })
  .strict();
