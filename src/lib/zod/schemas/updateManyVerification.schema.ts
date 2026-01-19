import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationUpdateManyMutationInputObjectSchema } from "./objects/VerificationUpdateManyMutationInput.schema";
import { VerificationWhereInputObjectSchema } from "./objects/VerificationWhereInput.schema";

export const VerificationUpdateManySchema: z.ZodType<Prisma.VerificationUpdateManyArgs> =
  z
    .object({
      data: VerificationUpdateManyMutationInputObjectSchema,
      where: VerificationWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationUpdateManyArgs>;

export const VerificationUpdateManyZodSchema = z
  .object({
    data: VerificationUpdateManyMutationInputObjectSchema,
    where: VerificationWhereInputObjectSchema.optional(),
  })
  .strict();
