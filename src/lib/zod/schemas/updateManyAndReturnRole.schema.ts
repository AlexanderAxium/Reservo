import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RoleSelectObjectSchema } from "./objects/RoleSelect.schema";
import { RoleUpdateManyMutationInputObjectSchema } from "./objects/RoleUpdateManyMutationInput.schema";
import { RoleWhereInputObjectSchema } from "./objects/RoleWhereInput.schema";

export const RoleUpdateManyAndReturnSchema: z.ZodType<Prisma.RoleUpdateManyAndReturnArgs> =
  z
    .object({
      select: RoleSelectObjectSchema.optional(),
      data: RoleUpdateManyMutationInputObjectSchema,
      where: RoleWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RoleUpdateManyAndReturnArgs>;

export const RoleUpdateManyAndReturnZodSchema = z
  .object({
    select: RoleSelectObjectSchema.optional(),
    data: RoleUpdateManyMutationInputObjectSchema,
    where: RoleWhereInputObjectSchema.optional(),
  })
  .strict();
