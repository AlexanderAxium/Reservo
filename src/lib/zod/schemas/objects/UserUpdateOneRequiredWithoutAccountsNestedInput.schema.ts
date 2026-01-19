import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateOrConnectWithoutAccountsInputObjectSchema } from "./UserCreateOrConnectWithoutAccountsInput.schema";
import { UserCreateWithoutAccountsInputObjectSchema } from "./UserCreateWithoutAccountsInput.schema";
import { UserUncheckedCreateWithoutAccountsInputObjectSchema } from "./UserUncheckedCreateWithoutAccountsInput.schema";
import { UserUncheckedUpdateWithoutAccountsInputObjectSchema } from "./UserUncheckedUpdateWithoutAccountsInput.schema";
import { UserUpdateToOneWithWhereWithoutAccountsInputObjectSchema } from "./UserUpdateToOneWithWhereWithoutAccountsInput.schema";
import { UserUpdateWithoutAccountsInputObjectSchema } from "./UserUpdateWithoutAccountsInput.schema";
import { UserUpsertWithoutAccountsInputObjectSchema } from "./UserUpsertWithoutAccountsInput.schema";
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
      upsert: z
        .lazy(() => UserUpsertWithoutAccountsInputObjectSchema)
        .optional(),
      connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => UserUpdateToOneWithWhereWithoutAccountsInputObjectSchema
          ),
          z.lazy(() => UserUpdateWithoutAccountsInputObjectSchema),
          z.lazy(() => UserUncheckedUpdateWithoutAccountsInputObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const UserUpdateOneRequiredWithoutAccountsNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput>;
export const UserUpdateOneRequiredWithoutAccountsNestedInputObjectZodSchema =
  makeSchema();
