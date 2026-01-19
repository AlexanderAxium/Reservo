import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      identifier: z.string(),
      value: z.string(),
    })
    .strict();
export const VerificationIdentifierValueCompoundUniqueInputObjectSchema: z.ZodType<Prisma.VerificationIdentifierValueCompoundUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.VerificationIdentifierValueCompoundUniqueInput>;
export const VerificationIdentifierValueCompoundUniqueInputObjectZodSchema =
  makeSchema();
