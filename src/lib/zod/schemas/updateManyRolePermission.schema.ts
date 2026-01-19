import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionUpdateManyMutationInputObjectSchema } from "./objects/RolePermissionUpdateManyMutationInput.schema";
import { RolePermissionWhereInputObjectSchema } from "./objects/RolePermissionWhereInput.schema";

export const RolePermissionUpdateManySchema: z.ZodType<Prisma.RolePermissionUpdateManyArgs> =
  z
    .object({
      data: RolePermissionUpdateManyMutationInputObjectSchema,
      where: RolePermissionWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionUpdateManyArgs>;

export const RolePermissionUpdateManyZodSchema = z
  .object({
    data: RolePermissionUpdateManyMutationInputObjectSchema,
    where: RolePermissionWhereInputObjectSchema.optional(),
  })
  .strict();
