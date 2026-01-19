import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleCreateWithoutRoleInputObjectSchema } from "./UserRoleCreateWithoutRoleInput.schema";
import { UserRoleUncheckedCreateWithoutRoleInputObjectSchema } from "./UserRoleUncheckedCreateWithoutRoleInput.schema";
import { UserRoleUncheckedUpdateWithoutRoleInputObjectSchema } from "./UserRoleUncheckedUpdateWithoutRoleInput.schema";
import { UserRoleUpdateWithoutRoleInputObjectSchema } from "./UserRoleUpdateWithoutRoleInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./UserRoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => UserRoleUpdateWithoutRoleInputObjectSchema),
        z.lazy(() => UserRoleUncheckedUpdateWithoutRoleInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => UserRoleCreateWithoutRoleInputObjectSchema),
        z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputObjectSchema),
      ]),
    })
    .strict();
export const UserRoleUpsertWithWhereUniqueWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserRoleUpsertWithWhereUniqueWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUpsertWithWhereUniqueWithoutRoleInput>;
export const UserRoleUpsertWithWhereUniqueWithoutRoleInputObjectZodSchema =
  makeSchema();
