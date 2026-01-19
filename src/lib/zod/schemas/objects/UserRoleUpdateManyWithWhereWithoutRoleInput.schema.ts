import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleScalarWhereInputObjectSchema } from "./UserRoleScalarWhereInput.schema";
import { UserRoleUncheckedUpdateManyWithoutRoleInputObjectSchema } from "./UserRoleUncheckedUpdateManyWithoutRoleInput.schema";
import { UserRoleUpdateManyMutationInputObjectSchema } from "./UserRoleUpdateManyMutationInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserRoleScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => UserRoleUpdateManyMutationInputObjectSchema),
        z.lazy(() => UserRoleUncheckedUpdateManyWithoutRoleInputObjectSchema),
      ]),
    })
    .strict();
export const UserRoleUpdateManyWithWhereWithoutRoleInputObjectSchema: z.ZodType<Prisma.UserRoleUpdateManyWithWhereWithoutRoleInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUpdateManyWithWhereWithoutRoleInput>;
export const UserRoleUpdateManyWithWhereWithoutRoleInputObjectZodSchema =
  makeSchema();
