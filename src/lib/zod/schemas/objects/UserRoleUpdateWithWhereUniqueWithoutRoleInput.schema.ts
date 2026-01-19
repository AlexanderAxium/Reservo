import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleUncheckedUpdateWithoutRoleInputObjectSchema } from "./UserRoleUncheckedUpdateWithoutRoleInput.schema";
import { UserRoleUpdateWithoutRoleInputObjectSchema } from "./UserRoleUpdateWithoutRoleInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./UserRoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => UserRoleUpdateWithoutRoleInputObjectSchema),
        z.lazy(() => UserRoleUncheckedUpdateWithoutRoleInputObjectSchema),
      ]),
    })
    .strict();
export const UserRoleUpdateWithWhereUniqueWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserRoleUpdateWithWhereUniqueWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUpdateWithWhereUniqueWithoutRoleInput>;
export const UserRoleUpdateWithWhereUniqueWithoutRoleInputObjectZodSchema =
  makeSchema();
