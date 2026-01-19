import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { AccountSelectObjectSchema } from "./objects/AccountSelect.schema";
import { AccountUpdateManyMutationInputObjectSchema } from "./objects/AccountUpdateManyMutationInput.schema";
import { AccountWhereInputObjectSchema } from "./objects/AccountWhereInput.schema";

export const AccountUpdateManyAndReturnSchema: z.ZodType<Prisma.AccountUpdateManyAndReturnArgs> =
  z
    .object({
      select: AccountSelectObjectSchema.optional(),
      data: AccountUpdateManyMutationInputObjectSchema,
      where: AccountWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.AccountUpdateManyAndReturnArgs>;

export const AccountUpdateManyAndReturnZodSchema = z
  .object({
    select: AccountSelectObjectSchema.optional(),
    data: AccountUpdateManyMutationInputObjectSchema,
    where: AccountWhereInputObjectSchema.optional(),
  })
  .strict();
