import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationCreateManyInputObjectSchema } from "./objects/VerificationCreateManyInput.schema";
import { VerificationSelectObjectSchema } from "./objects/VerificationSelect.schema";

export const VerificationCreateManyAndReturnSchema: z.ZodType<Prisma.VerificationCreateManyAndReturnArgs> =
  z
    .object({
      select: VerificationSelectObjectSchema.optional(),
      data: z.union([
        VerificationCreateManyInputObjectSchema,
        z.array(VerificationCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationCreateManyAndReturnArgs>;

export const VerificationCreateManyAndReturnZodSchema = z
  .object({
    select: VerificationSelectObjectSchema.optional(),
    data: z.union([
      VerificationCreateManyInputObjectSchema,
      z.array(VerificationCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
