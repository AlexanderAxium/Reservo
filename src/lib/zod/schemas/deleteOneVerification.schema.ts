import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationSelectObjectSchema } from "./objects/VerificationSelect.schema";
import { VerificationWhereUniqueInputObjectSchema } from "./objects/VerificationWhereUniqueInput.schema";

export const VerificationDeleteOneSchema: z.ZodType<Prisma.VerificationDeleteArgs> =
  z
    .object({
      select: VerificationSelectObjectSchema.optional(),
      where: VerificationWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationDeleteArgs>;

export const VerificationDeleteOneZodSchema = z
  .object({
    select: VerificationSelectObjectSchema.optional(),
    where: VerificationWhereUniqueInputObjectSchema,
  })
  .strict();
