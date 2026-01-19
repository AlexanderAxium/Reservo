import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleIncludeObjectSchema } from "./objects/UserRoleInclude.schema";
import { UserRoleSelectObjectSchema } from "./objects/UserRoleSelect.schema";
import { UserRoleUncheckedUpdateInputObjectSchema } from "./objects/UserRoleUncheckedUpdateInput.schema";
import { UserRoleUpdateInputObjectSchema } from "./objects/UserRoleUpdateInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./objects/UserRoleWhereUniqueInput.schema";

export const UserRoleUpdateOneSchema: z.ZodType<Prisma.UserRoleUpdateArgs> = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    include: UserRoleIncludeObjectSchema.optional(),
    data: z.union([
      UserRoleUpdateInputObjectSchema,
      UserRoleUncheckedUpdateInputObjectSchema,
    ]),
    where: UserRoleWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.UserRoleUpdateArgs>;

export const UserRoleUpdateOneZodSchema = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    include: UserRoleIncludeObjectSchema.optional(),
    data: z.union([
      UserRoleUpdateInputObjectSchema,
      UserRoleUncheckedUpdateInputObjectSchema,
    ]),
    where: UserRoleWhereUniqueInputObjectSchema,
  })
  .strict();
