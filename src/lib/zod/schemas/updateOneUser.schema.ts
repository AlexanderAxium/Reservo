import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserIncludeObjectSchema } from "./objects/UserInclude.schema";
import { UserSelectObjectSchema } from "./objects/UserSelect.schema";
import { UserUncheckedUpdateInputObjectSchema } from "./objects/UserUncheckedUpdateInput.schema";
import { UserUpdateInputObjectSchema } from "./objects/UserUpdateInput.schema";
import { UserWhereUniqueInputObjectSchema } from "./objects/UserWhereUniqueInput.schema";

export const UserUpdateOneSchema: z.ZodType<Prisma.UserUpdateArgs> = z
  .object({
    select: UserSelectObjectSchema.optional(),
    include: UserIncludeObjectSchema.optional(),
    data: z.union([
      UserUpdateInputObjectSchema,
      UserUncheckedUpdateInputObjectSchema,
    ]),
    where: UserWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.UserUpdateArgs>;

export const UserUpdateOneZodSchema = z
  .object({
    select: UserSelectObjectSchema.optional(),
    include: UserIncludeObjectSchema.optional(),
    data: z.union([
      UserUpdateInputObjectSchema,
      UserUncheckedUpdateInputObjectSchema,
    ]),
    where: UserWhereUniqueInputObjectSchema,
  })
  .strict();
