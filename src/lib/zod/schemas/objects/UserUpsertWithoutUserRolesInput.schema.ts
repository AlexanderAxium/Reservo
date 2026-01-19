import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateWithoutUserRolesInputObjectSchema } from "./UserCreateWithoutUserRolesInput.schema";
import { UserUncheckedCreateWithoutUserRolesInputObjectSchema } from "./UserUncheckedCreateWithoutUserRolesInput.schema";
import { UserUncheckedUpdateWithoutUserRolesInputObjectSchema } from "./UserUncheckedUpdateWithoutUserRolesInput.schema";
import { UserUpdateWithoutUserRolesInputObjectSchema } from "./UserUpdateWithoutUserRolesInput.schema";
import { UserWhereInputObjectSchema } from "./UserWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      update: z.union([
        z.lazy(() => UserUpdateWithoutUserRolesInputObjectSchema),
        z.lazy(() => UserUncheckedUpdateWithoutUserRolesInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutUserRolesInputObjectSchema),
        z.lazy(() => UserUncheckedCreateWithoutUserRolesInputObjectSchema),
      ]),
      where: z.lazy(() => UserWhereInputObjectSchema).optional(),
    })
    .strict();
export const UserUpsertWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.UserUpsertWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithoutUserRolesInput>;
export const UserUpsertWithoutUserRolesInputObjectZodSchema = makeSchema();
