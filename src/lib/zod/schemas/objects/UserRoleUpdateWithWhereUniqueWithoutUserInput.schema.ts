import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleUncheckedUpdateWithoutUserInputObjectSchema } from "./UserRoleUncheckedUpdateWithoutUserInput.schema";
import { UserRoleUpdateWithoutUserInputObjectSchema } from "./UserRoleUpdateWithoutUserInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./UserRoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => UserRoleUpdateWithoutUserInputObjectSchema),
        z.lazy(() => UserRoleUncheckedUpdateWithoutUserInputObjectSchema),
      ]),
    })
    .strict();
export const UserRoleUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.UserRoleUpdateWithWhereUniqueWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUpdateWithWhereUniqueWithoutUserInput>;
export const UserRoleUpdateWithWhereUniqueWithoutUserInputObjectZodSchema =
  makeSchema();
