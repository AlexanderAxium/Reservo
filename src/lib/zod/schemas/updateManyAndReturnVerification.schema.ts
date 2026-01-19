import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationSelectObjectSchema } from "./objects/VerificationSelect.schema";
import { VerificationUpdateManyMutationInputObjectSchema } from "./objects/VerificationUpdateManyMutationInput.schema";
import { VerificationWhereInputObjectSchema } from "./objects/VerificationWhereInput.schema";

export const VerificationUpdateManyAndReturnSchema: z.ZodType<Prisma.VerificationUpdateManyAndReturnArgs> =
  z
    .object({
      select: VerificationSelectObjectSchema.optional(),
      data: VerificationUpdateManyMutationInputObjectSchema,
      where: VerificationWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationUpdateManyAndReturnArgs>;

export const VerificationUpdateManyAndReturnZodSchema = z
  .object({
    select: VerificationSelectObjectSchema.optional(),
    data: VerificationUpdateManyMutationInputObjectSchema,
    where: VerificationWhereInputObjectSchema.optional(),
  })
  .strict();
