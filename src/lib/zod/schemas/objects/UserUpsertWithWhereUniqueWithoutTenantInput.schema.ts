import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateWithoutTenantInputObjectSchema } from "./UserCreateWithoutTenantInput.schema";
import { UserUncheckedCreateWithoutTenantInputObjectSchema } from "./UserUncheckedCreateWithoutTenantInput.schema";
import { UserUncheckedUpdateWithoutTenantInputObjectSchema } from "./UserUncheckedUpdateWithoutTenantInput.schema";
import { UserUpdateWithoutTenantInputObjectSchema } from "./UserUpdateWithoutTenantInput.schema";
import { UserWhereUniqueInputObjectSchema } from "./UserWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => UserUpdateWithoutTenantInputObjectSchema),
        z.lazy(() => UserUncheckedUpdateWithoutTenantInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => UserCreateWithoutTenantInputObjectSchema),
        z.lazy(() => UserUncheckedCreateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const UserUpsertWithWhereUniqueWithoutTenantInputObjectSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutTenantInput>;
export const UserUpsertWithWhereUniqueWithoutTenantInputObjectZodSchema =
  makeSchema();
