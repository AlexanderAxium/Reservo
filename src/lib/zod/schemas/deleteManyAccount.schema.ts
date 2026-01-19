import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { AccountWhereInputObjectSchema } from "./objects/AccountWhereInput.schema";

export const AccountDeleteManySchema: z.ZodType<Prisma.AccountDeleteManyArgs> =
  z
    .object({ where: AccountWhereInputObjectSchema.optional() })
    .strict() as unknown as z.ZodType<Prisma.AccountDeleteManyArgs>;

export const AccountDeleteManyZodSchema = z
  .object({ where: AccountWhereInputObjectSchema.optional() })
  .strict();
