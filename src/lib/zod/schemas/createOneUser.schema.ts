import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserCreateInputObjectSchema } from "./objects/UserCreateInput.schema";
import { UserIncludeObjectSchema } from "./objects/UserInclude.schema";
import { UserSelectObjectSchema } from "./objects/UserSelect.schema";
import { UserUncheckedCreateInputObjectSchema } from "./objects/UserUncheckedCreateInput.schema";

export const UserCreateOneSchema: z.ZodType<Prisma.UserCreateArgs> = z
  .object({
    select: UserSelectObjectSchema.optional(),
    include: UserIncludeObjectSchema.optional(),
    data: z.union([
      UserCreateInputObjectSchema,
      UserUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.UserCreateArgs>;

export const UserCreateOneZodSchema = z
  .object({
    select: UserSelectObjectSchema.optional(),
    include: UserIncludeObjectSchema.optional(),
    data: z.union([
      UserCreateInputObjectSchema,
      UserUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
