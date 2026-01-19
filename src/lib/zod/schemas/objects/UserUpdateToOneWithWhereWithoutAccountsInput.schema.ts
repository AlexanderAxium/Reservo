import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserUncheckedUpdateWithoutAccountsInputObjectSchema } from "./UserUncheckedUpdateWithoutAccountsInput.schema";
import { UserUpdateWithoutAccountsInputObjectSchema } from "./UserUpdateWithoutAccountsInput.schema";
import { UserWhereInputObjectSchema } from "./UserWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutAccountsInputObjectSchema),
        z.lazy(() => UserUncheckedUpdateWithoutAccountsInputObjectSchema),
      ]),
    })
    .strict();
export const UserUpdateToOneWithWhereWithoutAccountsInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput>;
export const UserUpdateToOneWithWhereWithoutAccountsInputObjectZodSchema =
  makeSchema();
