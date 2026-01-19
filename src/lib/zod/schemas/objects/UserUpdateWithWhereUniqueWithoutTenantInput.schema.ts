import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserUncheckedUpdateWithoutTenantInputObjectSchema } from "./UserUncheckedUpdateWithoutTenantInput.schema";
import { UserUpdateWithoutTenantInputObjectSchema } from "./UserUpdateWithoutTenantInput.schema";
import { UserWhereUniqueInputObjectSchema } from "./UserWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => UserUpdateWithoutTenantInputObjectSchema),
        z.lazy(() => UserUncheckedUpdateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const UserUpdateWithWhereUniqueWithoutTenantInputObjectSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutTenantInput>;
export const UserUpdateWithWhereUniqueWithoutTenantInputObjectZodSchema =
  makeSchema();
