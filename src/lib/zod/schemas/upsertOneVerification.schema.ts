import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { VerificationCreateInputObjectSchema } from "./objects/VerificationCreateInput.schema";
import { VerificationSelectObjectSchema } from "./objects/VerificationSelect.schema";
import { VerificationUncheckedCreateInputObjectSchema } from "./objects/VerificationUncheckedCreateInput.schema";
import { VerificationUncheckedUpdateInputObjectSchema } from "./objects/VerificationUncheckedUpdateInput.schema";
import { VerificationUpdateInputObjectSchema } from "./objects/VerificationUpdateInput.schema";
import { VerificationWhereUniqueInputObjectSchema } from "./objects/VerificationWhereUniqueInput.schema";

export const VerificationUpsertOneSchema: z.ZodType<Prisma.VerificationUpsertArgs> =
  z
    .object({
      select: VerificationSelectObjectSchema.optional(),
      where: VerificationWhereUniqueInputObjectSchema,
      create: z.union([
        VerificationCreateInputObjectSchema,
        VerificationUncheckedCreateInputObjectSchema,
      ]),
      update: z.union([
        VerificationUpdateInputObjectSchema,
        VerificationUncheckedUpdateInputObjectSchema,
      ]),
    })
    .strict() as unknown as z.ZodType<Prisma.VerificationUpsertArgs>;

export const VerificationUpsertOneZodSchema = z
  .object({
    select: VerificationSelectObjectSchema.optional(),
    where: VerificationWhereUniqueInputObjectSchema,
    create: z.union([
      VerificationCreateInputObjectSchema,
      VerificationUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      VerificationUpdateInputObjectSchema,
      VerificationUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();
