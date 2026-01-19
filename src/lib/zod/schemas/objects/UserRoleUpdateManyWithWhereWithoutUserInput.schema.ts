import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { UserRoleScalarWhereInputObjectSchema } from "./UserRoleScalarWhereInput.schema";
import { UserRoleUncheckedUpdateManyWithoutUserInputObjectSchema } from "./UserRoleUncheckedUpdateManyWithoutUserInput.schema";
import { UserRoleUpdateManyMutationInputObjectSchema } from "./UserRoleUpdateManyMutationInput.schema";

const makeSchema = () =>
  z
    .object({
      where: z.lazy(() => UserRoleScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => UserRoleUpdateManyMutationInputObjectSchema),
        z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserInputObjectSchema),
      ]),
    })
    .strict();
export const UserRoleUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.UserRoleUpdateManyWithWhereWithoutUserInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserRoleUpdateManyWithWhereWithoutUserInput>;
export const UserRoleUpdateManyWithWhereWithoutUserInputObjectZodSchema =
  makeSchema();
