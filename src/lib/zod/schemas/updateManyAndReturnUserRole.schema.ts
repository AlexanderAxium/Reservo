import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleSelectObjectSchema } from "./objects/UserRoleSelect.schema";
import { UserRoleUpdateManyMutationInputObjectSchema } from "./objects/UserRoleUpdateManyMutationInput.schema";
import { UserRoleWhereInputObjectSchema } from "./objects/UserRoleWhereInput.schema";

export const UserRoleUpdateManyAndReturnSchema: z.ZodType<Prisma.UserRoleUpdateManyAndReturnArgs> =
  z
    .object({
      select: UserRoleSelectObjectSchema.optional(),
      data: UserRoleUpdateManyMutationInputObjectSchema,
      where: UserRoleWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserRoleUpdateManyAndReturnArgs>;

export const UserRoleUpdateManyAndReturnZodSchema = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    data: UserRoleUpdateManyMutationInputObjectSchema,
    where: UserRoleWhereInputObjectSchema.optional(),
  })
  .strict();
