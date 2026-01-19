import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { AccountCreateInputObjectSchema } from "./objects/AccountCreateInput.schema";
import { AccountIncludeObjectSchema } from "./objects/AccountInclude.schema";
import { AccountSelectObjectSchema } from "./objects/AccountSelect.schema";
import { AccountUncheckedCreateInputObjectSchema } from "./objects/AccountUncheckedCreateInput.schema";

export const AccountCreateOneSchema: z.ZodType<Prisma.AccountCreateArgs> = z
  .object({
    select: AccountSelectObjectSchema.optional(),
    include: AccountIncludeObjectSchema.optional(),
    data: z.union([
      AccountCreateInputObjectSchema,
      AccountUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.AccountCreateArgs>;

export const AccountCreateOneZodSchema = z
  .object({
    select: AccountSelectObjectSchema.optional(),
    include: AccountIncludeObjectSchema.optional(),
    data: z.union([
      AccountCreateInputObjectSchema,
      AccountUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
