import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleCreateInputObjectSchema } from "./objects/UserRoleCreateInput.schema";
import { UserRoleIncludeObjectSchema } from "./objects/UserRoleInclude.schema";
import { UserRoleSelectObjectSchema } from "./objects/UserRoleSelect.schema";
import { UserRoleUncheckedCreateInputObjectSchema } from "./objects/UserRoleUncheckedCreateInput.schema";
import { UserRoleUncheckedUpdateInputObjectSchema } from "./objects/UserRoleUncheckedUpdateInput.schema";
import { UserRoleUpdateInputObjectSchema } from "./objects/UserRoleUpdateInput.schema";
import { UserRoleWhereUniqueInputObjectSchema } from "./objects/UserRoleWhereUniqueInput.schema";

export const UserRoleUpsertOneSchema: z.ZodType<Prisma.UserRoleUpsertArgs> = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    include: UserRoleIncludeObjectSchema.optional(),
    where: UserRoleWhereUniqueInputObjectSchema,
    create: z.union([
      UserRoleCreateInputObjectSchema,
      UserRoleUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      UserRoleUpdateInputObjectSchema,
      UserRoleUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.UserRoleUpsertArgs>;

export const UserRoleUpsertOneZodSchema = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    include: UserRoleIncludeObjectSchema.optional(),
    where: UserRoleWhereUniqueInputObjectSchema,
    create: z.union([
      UserRoleCreateInputObjectSchema,
      UserRoleUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      UserRoleUpdateInputObjectSchema,
      UserRoleUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();
