import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserUncheckedUpdateWithoutSessionsInputObjectSchema } from "./UserUncheckedUpdateWithoutSessionsInput.schema";
import { UserUpdateWithoutSessionsInputObjectSchema } from "./UserUpdateWithoutSessionsInput.schema";
import { UserWhereInputObjectSchema } from "./UserWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserWhereInputObjectSchema).optional(),
      data: z.union([
        z.lazy(() => UserUpdateWithoutSessionsInputObjectSchema),
        z.lazy(() => UserUncheckedUpdateWithoutSessionsInputObjectSchema),
      ]),
    })
    .strict();
export const UserUpdateToOneWithWhereWithoutSessionsInputObjectSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput>;
export const UserUpdateToOneWithWhereWithoutSessionsInputObjectZodSchema =
  makeSchema();
