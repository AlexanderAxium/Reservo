import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionIncludeObjectSchema } from "./objects/RolePermissionInclude.schema";
import { RolePermissionSelectObjectSchema } from "./objects/RolePermissionSelect.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./objects/RolePermissionWhereUniqueInput.schema";

export const RolePermissionFindUniqueSchema: z.ZodType<Prisma.RolePermissionFindUniqueArgs> =
  z
    .object({
      select: RolePermissionSelectObjectSchema.optional(),
      include: RolePermissionIncludeObjectSchema.optional(),
      where: RolePermissionWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionFindUniqueArgs>;

export const RolePermissionFindUniqueZodSchema = z
  .object({
    select: RolePermissionSelectObjectSchema.optional(),
    include: RolePermissionIncludeObjectSchema.optional(),
    where: RolePermissionWhereUniqueInputObjectSchema,
  })
  .strict();
