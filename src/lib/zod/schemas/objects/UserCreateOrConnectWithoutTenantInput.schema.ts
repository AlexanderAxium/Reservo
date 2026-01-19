import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserCreateWithoutTenantInputObjectSchema } from "./UserCreateWithoutTenantInput.schema";
import { UserUncheckedCreateWithoutTenantInputObjectSchema } from "./UserUncheckedCreateWithoutTenantInput.schema";
import { UserWhereUniqueInputObjectSchema } from "./UserWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => UserCreateWithoutTenantInputObjectSchema),
        z.lazy(() => UserUncheckedCreateWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const UserCreateOrConnectWithoutTenantInputObjectSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateOrConnectWithoutTenantInput>;
export const UserCreateOrConnectWithoutTenantInputObjectZodSchema =
  makeSchema();
