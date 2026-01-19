import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleCreateManyInputObjectSchema } from "./objects/UserRoleCreateManyInput.schema";
import { UserRoleSelectObjectSchema } from "./objects/UserRoleSelect.schema";

export const UserRoleCreateManyAndReturnSchema: z.ZodType<Prisma.UserRoleCreateManyAndReturnArgs> =
  z
    .object({
      select: UserRoleSelectObjectSchema.optional(),
      data: z.union([
        UserRoleCreateManyInputObjectSchema,
        z.array(UserRoleCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserRoleCreateManyAndReturnArgs>;

export const UserRoleCreateManyAndReturnZodSchema = z
  .object({
    select: UserRoleSelectObjectSchema.optional(),
    data: z.union([
      UserRoleCreateManyInputObjectSchema,
      z.array(UserRoleCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
