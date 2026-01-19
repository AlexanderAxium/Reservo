import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { AccountIncludeObjectSchema } from "./objects/AccountInclude.schema";
import { AccountSelectObjectSchema } from "./objects/AccountSelect.schema";
import { AccountWhereUniqueInputObjectSchema } from "./objects/AccountWhereUniqueInput.schema";

export const AccountDeleteOneSchema: z.ZodType<Prisma.AccountDeleteArgs> = z
  .object({
    select: AccountSelectObjectSchema.optional(),
    include: AccountIncludeObjectSchema.optional(),
    where: AccountWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.AccountDeleteArgs>;

export const AccountDeleteOneZodSchema = z
  .object({
    select: AccountSelectObjectSchema.optional(),
    include: AccountIncludeObjectSchema.optional(),
    where: AccountWhereUniqueInputObjectSchema,
  })
  .strict();
