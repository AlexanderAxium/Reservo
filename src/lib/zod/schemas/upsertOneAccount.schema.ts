import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { AccountCreateInputObjectSchema } from "./objects/AccountCreateInput.schema";
import { AccountIncludeObjectSchema } from "./objects/AccountInclude.schema";
import { AccountSelectObjectSchema } from "./objects/AccountSelect.schema";
import { AccountUncheckedCreateInputObjectSchema } from "./objects/AccountUncheckedCreateInput.schema";
import { AccountUncheckedUpdateInputObjectSchema } from "./objects/AccountUncheckedUpdateInput.schema";
import { AccountUpdateInputObjectSchema } from "./objects/AccountUpdateInput.schema";
import { AccountWhereUniqueInputObjectSchema } from "./objects/AccountWhereUniqueInput.schema";

export const AccountUpsertOneSchema: z.ZodType<Prisma.AccountUpsertArgs> = z
  .object({
    select: AccountSelectObjectSchema.optional(),
    include: AccountIncludeObjectSchema.optional(),
    where: AccountWhereUniqueInputObjectSchema,
    create: z.union([
      AccountCreateInputObjectSchema,
      AccountUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      AccountUpdateInputObjectSchema,
      AccountUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.AccountUpsertArgs>;

export const AccountUpsertOneZodSchema = z
  .object({
    select: AccountSelectObjectSchema.optional(),
    include: AccountIncludeObjectSchema.optional(),
    where: AccountWhereUniqueInputObjectSchema,
    create: z.union([
      AccountCreateInputObjectSchema,
      AccountUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      AccountUpdateInputObjectSchema,
      AccountUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();
