import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleIncludeObjectSchema } from "./objects/UserRoleInclude.schema";
import { UserRoleSelectObjectSchema } from "./objects/UserRoleSelect.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./objects/UserRoleWhereUniqueInput.schema";

export const UserRoleDeleteOneSchema: z.ZodType<Prisma.UserRoleDeleteArgs> = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    include: UserRoleIncludeObjectSchema.optional(),
    where: UserRoleWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.UserRoleDeleteArgs>;

export const UserRoleDeleteOneZodSchema = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    include: UserRoleIncludeObjectSchema.optional(),
    where: UserRoleWhereUniqueInputObjectSchema,
  })
  .strict();
