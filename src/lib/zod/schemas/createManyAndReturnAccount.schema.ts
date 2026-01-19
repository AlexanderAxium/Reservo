import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { AccountCreateManyInputObjectSchema } from "./objects/AccountCreateManyInput.schema";
import { AccountSelectObjectSchema } from "./objects/AccountSelect.schema";

export const AccountCreateManyAndReturnSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> =
  z
    .object({
      select: AccountSelectObjectSchema.optional(),
      data: z.union([
        AccountCreateManyInputObjectSchema,
        z.array(AccountCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.AccountCreateManyAndReturnArgs>;

export const AccountCreateManyAndReturnZodSchema = z
  .object({
    select: AccountSelectObjectSchema.optional(),
    data: z.union([
      AccountCreateManyInputObjectSchema,
      z.array(AccountCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
