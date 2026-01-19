import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationSelectObjectSchema } from "./objects/VerificationSelect.schema";
import { VerificationWhereUniqueInputObjectSchema } from "./objects/VerificationWhereUniqueInput.schema";

export const VerificationFindUniqueOrThrowSchema: z.ZodType<Prisma.VerificationFindUniqueOrThrowArgs> =
  z
    .object({
      select: VerificationSelectObjectSchema.optional(),
      where: VerificationWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationFindUniqueOrThrowArgs>;

export const VerificationFindUniqueOrThrowZodSchema = z
  .object({
    select: VerificationSelectObjectSchema.optional(),
    where: VerificationWhereUniqueInputObjectSchema,
  })
  .strict();
