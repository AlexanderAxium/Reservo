import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleCreateWithoutRoleInputObjectSchema } from "./UserRoleCreateWithoutRoleInput.schema";
import { UserRoleUncheckedCreateWithoutRoleInputObjectSchema } from "./UserRoleUncheckedCreateWithoutRoleInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./UserRoleWhereUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserRoleWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => UserRoleCreateWithoutRoleInputObjectSchema),
        z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputObjectSchema),
      ]),
    })
    .strict();
export const UserRoleCreateOrConnectWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserRoleCreateOrConnectWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleCreateOrConnectWithoutRoleInput>;
export const UserRoleCreateOrConnectWithoutRoleInputObjectZodSchema =
  makeSchema();
