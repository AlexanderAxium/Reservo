import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { UserRoleWhereInputObjectSchema } from "./objects/UserRoleWhereInput.schema";

export const UserRoleDeleteManySchema: z.ZodType<Prisma.UserRoleDeleteManyArgs> =
  z
    .object({ where: UserRoleWhereInputObjectSchema.optional() })
    .strict() as unknown as z.ZodType<Prisma.UserRoleDeleteManyArgs>;

export const UserRoleDeleteManyZodSchema = z
  .object({ where: UserRoleWhereInputObjectSchema.optional() })
  .strict();
