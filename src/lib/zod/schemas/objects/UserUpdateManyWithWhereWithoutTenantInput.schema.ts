import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserScalarWhereInputObjectSchema } from "./UserScalarWhereInput.schema";
import { UserUncheckedUpdateManyWithoutTenantInputObjectSchema } from "./UserUncheckedUpdateManyWithoutTenantInput.schema";
import { UserUpdateManyMutationInputObjectSchema } from "./UserUpdateManyMutationInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => UserUpdateManyMutationInputObjectSchema),
        z.lazy(() => UserUncheckedUpdateManyWithoutTenantInputObjectSchema),
      ]),
    })
    .strict();
export const UserUpdateManyWithWhereWithoutTenantInputObjectSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutTenantInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserUpdateManyWithWhereWithoutTenantInput>;
export const UserUpdateManyWithWhereWithoutTenantInputObjectZodSchema =
  makeSchema();
