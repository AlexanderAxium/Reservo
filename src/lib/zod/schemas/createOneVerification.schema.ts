import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationCreateInputObjectSchema } from "./objects/VerificationCreateInput.schema";
import { VerificationSelectObjectSchema } from "./objects/VerificationSelect.schema";
import { VerificationUncheckedCreateInputObjectSchema } from "./objects/VerificationUncheckedCreateInput.schema";

export const VerificationCreateOneSchema: z.ZodType<Prisma.VerificationCreateArgs> =
  z
    .object({
      select: VerificationSelectObjectSchema.optional(),
      data: z.union([
        VerificationCreateInputObjectSchema,
        VerificationUncheckedCreateInputObjectSchema,
      ]),
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationCreateArgs>;

export const VerificationCreateOneZodSchema = z
  .object({
    select: VerificationSelectObjectSchema.optional(),
    data: z.union([
      VerificationCreateInputObjectSchema,
      VerificationUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
