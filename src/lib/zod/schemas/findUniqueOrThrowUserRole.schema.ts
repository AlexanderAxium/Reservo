import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleIncludeObjectSchema } from "./objects/UserRoleInclude.schema";
import { UserRoleSelectObjectSchema } from "./objects/UserRoleSelect.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./objects/UserRoleWhereUniqueInput.schema";

export const UserRoleFindUniqueOrThrowSchema: z.ZodType<Prisma.UserRoleFindUniqueOrThrowArgs> =
  z
    .object({
      select: UserRoleSelectObjectSchema.optional(),
      include: UserRoleIncludeObjectSchema.optional(),
      where: UserRoleWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.UserRoleFindUniqueOrThrowArgs>;

export const UserRoleFindUniqueOrThrowZodSchema = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    include: UserRoleIncludeObjectSchema.optional(),
    where: UserRoleWhereUniqueInputObjectSchema,
  })
  .strict();
