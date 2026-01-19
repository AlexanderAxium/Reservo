import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { VerificationIdentifierValueCompoundUniqueInputObjectSchema } from "./VerificationIdentifierValueCompoundUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      identifier_value: z
        .lazy(() => VerificationIdentifierValueCompoundUniqueInputObjectSchema)
        .optional(),
    })
    .strict();
export const VerificationWhereUniqueInputObjectSchema: z.ZodType<Prisma.VerificationWhereUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.VerificationWhereUniqueInput>;
export const VerificationWhereUniqueInputObjectZodSchema = makeSchema();
