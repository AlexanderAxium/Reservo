import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleCreateWithoutUserInputObjectSchema } from "./UserRoleCreateWithoutUserInput.schema";
import { UserRoleUncheckedCreateWithoutUserInputObjectSchema } from "./UserRoleUncheckedCreateWithoutUserInput.schema";
import { UserRoleUncheckedUpdateWithoutUserInputObjectSchema } from "./UserRoleUncheckedUpdateWithoutUserInput.schema";
import { UserRoleUpdateWithoutUserInputObjectSchema } from "./UserRoleUpdateWithoutUserInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./UserRoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => UserRoleUpdateWithoutUserInputObjectSchema),
        z.lazy(() => UserRoleUncheckedUpdateWithoutUserInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => UserRoleCreateWithoutUserInputObjectSchema),
        z.lazy(() => UserRoleUncheckedCreateWithoutUserInputObjectSchema),
      ]),
    })
    .strict();
export const UserRoleUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.UserRoleUpsertWithWhereUniqueWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUpsertWithWhereUniqueWithoutUserInput>;
export const UserRoleUpsertWithWhereUniqueWithoutUserInputObjectZodSchema =
  makeSchema();
