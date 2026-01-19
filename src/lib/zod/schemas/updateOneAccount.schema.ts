import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { AccountIncludeObjectSchema } from "./objects/AccountInclude.schema";
import { AccountSelectObjectSchema } from "./objects/AccountSelect.schema";
import { AccountUncheckedUpdateInputObjectSchema } from "./objects/AccountUncheckedUpdateInput.schema";
import { AccountUpdateInputObjectSchema } from "./objects/AccountUpdateInput.schema";
import { AccountWhereUniqueInputObjectSchema } from "./objects/AccountWhereUniqueInput.schema";

export const AccountUpdateOneSchema: z.ZodType<Prisma.AccountUpdateArgs> = z
  .object({
    select: AccountSelectObjectSchema.optional(),
    include: AccountIncludeObjectSchema.optional(),
    data: z.union([
      AccountUpdateInputObjectSchema,
      AccountUncheckedUpdateInputObjectSchema,
    ]),
    where: AccountWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.AccountUpdateArgs>;

export const AccountUpdateOneZodSchema = z
  .object({
    select: AccountSelectObjectSchema.optional(),
    include: AccountIncludeObjectSchema.optional(),
    data: z.union([
      AccountUpdateInputObjectSchema,
      AccountUncheckedUpdateInputObjectSchema,
    ]),
    where: AccountWhereUniqueInputObjectSchema,
  })
  .strict();
