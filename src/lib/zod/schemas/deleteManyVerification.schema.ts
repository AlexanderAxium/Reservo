import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationWhereInputObjectSchema } from "./objects/VerificationWhereInput.schema";

export const VerificationDeleteManySchema: z.ZodType<Prisma.VerificationDeleteManyArgs> =
  z
    .object({ where: VerificationWhereInputObjectSchema.optional() })
    .strict() as unknown as z.ZodType<Prisma.VerificationDeleteManyArgs>;

export const VerificationDeleteManyZodSchema = z
  .object({ where: VerificationWhereInputObjectSchema.optional() })
  .strict();
