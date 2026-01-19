import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserUncheckedUpdateWithoutUserRolesInputObjectSchema } from "./UserUncheckedUpdateWithoutUserRolesInput.schema";
import { UserUpdateWithoutUserRolesInputObjectSchema } from "./UserUpdateWithoutUserRolesInput.schema";
import { UserWhereInputObjectSchema } from "./UserWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutUserRolesInputObjectSchema),
        z.lazy(() => UserUncheckedUpdateWithoutUserRolesInputObjectSchema),
      ]),
    })
    .strict();
export const UserUpdateToOneWithWhereWithoutUserRolesInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutUserRolesInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutUserRolesInput>;
export const UserUpdateToOneWithWhereWithoutUserRolesInputObjectZodSchema =
  makeSchema();
