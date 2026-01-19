import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateOrConnectWithoutUserRolesInputObjectSchema } from "./UserCreateOrConnectWithoutUserRolesInput.schema";
import { UserCreateWithoutUserRolesInputObjectSchema } from "./UserCreateWithoutUserRolesInput.schema";
import { UserUncheckedCreateWithoutUserRolesInputObjectSchema } from "./UserUncheckedCreateWithoutUserRolesInput.schema";
import { UserWhereUniqueInputObjectSchema } from "./UserWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      create: z
        .union([
          z.lazy(() => UserCreateWithoutUserRolesInputObjectSchema),
          z.lazy(() => UserUncheckedCreateWithoutUserRolesInputObjectSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => UserCreateOrConnectWithoutUserRolesInputObjectSchema)
        .optional(),
      connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
    })
    .strict();
export const UserCreateNestedOneWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateNestedOneWithoutUserRolesInput>;
export const UserCreateNestedOneWithoutUserRolesInputObjectZodSchema =
  makeSchema();
