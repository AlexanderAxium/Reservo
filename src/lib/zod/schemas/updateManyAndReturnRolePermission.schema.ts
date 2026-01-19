import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionSelectObjectSchema } from "./objects/RolePermissionSelect.schema";
import { RolePermissionUpdateManyMutationInputObjectSchema } from "./objects/RolePermissionUpdateManyMutationInput.schema";
import { RolePermissionWhereInputObjectSchema } from "./objects/RolePermissionWhereInput.schema";

export const RolePermissionUpdateManyAndReturnSchema: z.ZodType<Prisma.RolePermissionUpdateManyAndReturnArgs> =
  z
    .object({
      select: RolePermissionSelectObjectSchema.optional(),
      data: RolePermissionUpdateManyMutationInputObjectSchema,
      where: RolePermissionWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionUpdateManyAndReturnArgs>;

export const RolePermissionUpdateManyAndReturnZodSchema = z
  .object({
    select: RolePermissionSelectObjectSchema.optional(),
    data: RolePermissionUpdateManyMutationInputObjectSchema,
    where: RolePermissionWhereInputObjectSchema.optional(),
  })
  .strict();
