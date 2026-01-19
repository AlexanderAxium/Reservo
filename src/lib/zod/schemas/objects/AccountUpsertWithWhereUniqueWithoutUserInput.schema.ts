import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { AccountCreateWithoutUserInputObjectSchema } from "./AccountCreateWithoutUserInput.schema";
import { AccountUncheckedCreateWithoutUserInputObjectSchema } from "./AccountUncheckedCreateWithoutUserInput.schema";
import { AccountUncheckedUpdateWithoutUserInputObjectSchema } from "./AccountUncheckedUpdateWithoutUserInput.schema";
import { AccountUpdateWithoutUserInputObjectSchema } from "./AccountUpdateWithoutUserInput.schema";
import { AccountWhereUniqueInputObjectSchema } from "./AccountWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => AccountWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => AccountUpdateWithoutUserInputObjectSchema),
        z.lazy(() => AccountUncheckedUpdateWithoutUserInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => AccountCreateWithoutUserInputObjectSchema),
        z.lazy(() => AccountUncheckedCreateWithoutUserInputObjectSchema),
      ]),
    })
    .strict();
export const AccountUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput>;
export const AccountUpsertWithWhereUniqueWithoutUserInputObjectZodSchema =
  makeSchema();
