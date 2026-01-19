import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateOrConnectWithoutAccountsInputObjectSchema } from "./UserCreateOrConnectWithoutAccountsInput.schema";
import { UserCreateWithoutAccountsInputObjectSchema } from "./UserCreateWithoutAccountsInput.schema";
import { UserUncheckedCreateWithoutAccountsInputObjectSchema } from "./UserUncheckedCreateWithoutAccountsInput.schema";
import { UserWhereUniqueInputObjectSchema } from "./UserWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutAccountsInputObjectSchema),
          z.lazy(() => UserUncheckedCreateWithoutAccountsInputObjectSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => UserCreateOrConnectWithoutAccountsInputObjectSchema)
        .optional(),
      connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
    })
    .strict();
export const UserCreateNestedOneWithoutAccountsInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput>;
export const UserCreateNestedOneWithoutAccountsInputObjectZodSchema =
  makeSchema();
