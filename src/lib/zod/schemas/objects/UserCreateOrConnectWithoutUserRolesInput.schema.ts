import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateWithoutUserRolesInputObjectSchema } from "./UserCreateWithoutUserRolesInput.schema";
import { UserUncheckedCreateWithoutUserRolesInputObjectSchema } from "./UserUncheckedCreateWithoutUserRolesInput.schema";
import { UserWhereUniqueInputObjectSchema } from "./UserWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutUserRolesInputObjectSchema),
        z.lazy(() => UserUncheckedCreateWithoutUserRolesInputObjectSchema),
      ]),
    })
    .strict();
export const UserCreateOrConnectWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutUserRolesInput>;
export const UserCreateOrConnectWithoutUserRolesInputObjectZodSchema =
  makeSchema();
