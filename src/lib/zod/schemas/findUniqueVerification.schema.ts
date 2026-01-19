import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationSelectObjectSchema } from "./objects/VerificationSelect.schema";
import { VerificationWhereUniqueInputObjectSchema } from "./objects/VerificationWhereUniqueInput.schema";

export const VerificationFindUniqueSchema: z.ZodType<Prisma.VerificationFindUniqueArgs> =
  z
    .object({
      select: VerificationSelectObjectSchema.optional(),
      where: VerificationWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationFindUniqueArgs>;

export const VerificationFindUniqueZodSchema = z
  .object({
    select: VerificationSelectObjectSchema.optional(),
    where: VerificationWhereUniqueInputObjectSchema,
  })
  .strict();
