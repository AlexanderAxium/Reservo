import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleCreateManyInputObjectSchema } from "./objects/UserRoleCreateManyInput.schema";

export const UserRoleCreateManySchema: z.ZodType<Prisma.UserRoleCreateManyArgs> =
  z
    .object({
      data: z.union([
        UserRoleCreateManyInputObjectSchema,
        z.array(UserRoleCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.UserRoleCreateManyArgs>;

export const UserRoleCreateManyZodSchema = z
  .object({
    data: z.union([
      UserRoleCreateManyInputObjectSchema,
      z.array(UserRoleCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
