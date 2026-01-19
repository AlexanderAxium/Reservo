import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { AccountUpdateManyMutationInputObjectSchema } from "./objects/AccountUpdateManyMutationInput.schema";
import { AccountWhereInputObjectSchema } from "./objects/AccountWhereInput.schema";

export const AccountUpdateManySchema: z.ZodType<Prisma.AccountUpdateManyArgs> =
  z
    .object({
      data: AccountUpdateManyMutationInputObjectSchema,
      where: AccountWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.AccountUpdateManyArgs>;

export const AccountUpdateManyZodSchema = z
  .object({
    data: AccountUpdateManyMutationInputObjectSchema,
    where: AccountWhereInputObjectSchema.optional(),
  })
  .strict();
