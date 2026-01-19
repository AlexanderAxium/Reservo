import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { AccountUncheckedUpdateWithoutUserInputObjectSchema } from "./AccountUncheckedUpdateWithoutUserInput.schema";
import { AccountUpdateWithoutUserInputObjectSchema } from "./AccountUpdateWithoutUserInput.schema";
import { AccountWhereUniqueInputObjectSchema } from "./AccountWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => AccountWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => AccountUpdateWithoutUserInputObjectSchema),
        z.lazy(() => AccountUncheckedUpdateWithoutUserInputObjectSchema),
      ]),
    })
    .strict();
export const AccountUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput>;
export const AccountUpdateWithWhereUniqueWithoutUserInputObjectZodSchema =
  makeSchema();
