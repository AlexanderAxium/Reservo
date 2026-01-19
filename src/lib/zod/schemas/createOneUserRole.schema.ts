import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleCreateInputObjectSchema } from "./objects/UserRoleCreateInput.schema";
import { UserRoleIncludeObjectSchema } from "./objects/UserRoleInclude.schema";
import { UserRoleSelectObjectSchema } from "./objects/UserRoleSelect.schema";
import { UserRoleUncheckedCreateInputObjectSchema } from "./objects/UserRoleUncheckedCreateInput.schema";

export const UserRoleCreateOneSchema: z.ZodType<Prisma.UserRoleCreateArgs> = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    include: UserRoleIncludeObjectSchema.optional(),
    data: z.union([
      UserRoleCreateInputObjectSchema,
      UserRoleUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.UserRoleCreateArgs>;

export const UserRoleCreateOneZodSchema = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    include: UserRoleIncludeObjectSchema.optional(),
    data: z.union([
      UserRoleCreateInputObjectSchema,
      UserRoleUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
