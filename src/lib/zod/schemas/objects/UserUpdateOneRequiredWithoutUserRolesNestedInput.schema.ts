import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateOrConnectWithoutUserRolesInputObjectSchema } from "./UserCreateOrConnectWithoutUserRolesInput.schema";
import { UserCreateWithoutUserRolesInputObjectSchema } from "./UserCreateWithoutUserRolesInput.schema";
import { UserUncheckedCreateWithoutUserRolesInputObjectSchema } from "./UserUncheckedCreateWithoutUserRolesInput.schema";
import { UserUncheckedUpdateWithoutUserRolesInputObjectSchema } from "./UserUncheckedUpdateWithoutUserRolesInput.schema";
import { UserUpdateToOneWithWhereWithoutUserRolesInputObjectSchema } from "./UserUpdateToOneWithWhereWithoutUserRolesInput.schema";
import { UserUpdateWithoutUserRolesInputObjectSchema } from "./UserUpdateWithoutUserRolesInput.schema";
import { UserUpsertWithoutUserRolesInputObjectSchema } from "./UserUpsertWithoutUserRolesInput.schema";
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
      upsert: z
        .lazy(() => UserUpsertWithoutUserRolesInputObjectSchema)
        .optional(),
      connect: z.lazy(() => UserWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(
            () => UserUpdateToOneWithWhereWithoutUserRolesInputObjectSchema
          ),
          z.lazy(() => UserUpdateWithoutUserRolesInputObjectSchema),
          z.lazy(() => UserUncheckedUpdateWithoutUserRolesInputObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const UserUpdateOneRequiredWithoutUserRolesNestedInputObjectSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUserRolesNestedInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserUpdateOneRequiredWithoutUserRolesNestedInput>;
export const UserUpdateOneRequiredWithoutUserRolesNestedInputObjectZodSchema =
  makeSchema();
