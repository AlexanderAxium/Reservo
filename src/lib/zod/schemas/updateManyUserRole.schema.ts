import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleUpdateManyMutationInputObjectSchema } from "./objects/UserRoleUpdateManyMutationInput.schema";
import { UserRoleWhereInputObjectSchema } from "./objects/UserRoleWhereInput.schema";

export const UserRoleUpdateManySchema: z.ZodType<Prisma.UserRoleUpdateManyArgs> =
  z
    .object({
      data: UserRoleUpdateManyMutationInputObjectSchema,
      where: UserRoleWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserRoleUpdateManyArgs>;

export const UserRoleUpdateManyZodSchema = z
  .object({
    data: UserRoleUpdateManyMutationInputObjectSchema,
    where: UserRoleWhereInputObjectSchema.optional(),
  })
  .strict();
