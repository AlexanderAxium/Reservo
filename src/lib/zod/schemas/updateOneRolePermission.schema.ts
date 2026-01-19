import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionIncludeObjectSchema } from "./objects/RolePermissionInclude.schema";
import { RolePermissionSelectObjectSchema } from "./objects/RolePermissionSelect.schema";
import { RolePermissionUncheckedUpdateInputObjectSchema } from "./objects/RolePermissionUncheckedUpdateInput.schema";
import { RolePermissionUpdateInputObjectSchema } from "./objects/RolePermissionUpdateInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./objects/RolePermissionWhereUniqueInput.schema";

export const RolePermissionUpdateOneSchema: z.ZodType<Prisma.RolePermissionUpdateArgs> =
  z
    .object({
      select: RolePermissionSelectObjectSchema.optional(),
      include: RolePermissionIncludeObjectSchema.optional(),
      data: z.union([
        RolePermissionUpdateInputObjectSchema,
        RolePermissionUncheckedUpdateInputObjectSchema,
      ]),
      where: RolePermissionWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionUpdateArgs>;

export const RolePermissionUpdateOneZodSchema = z
  .object({
    select: RolePermissionSelectObjectSchema.optional(),
    include: RolePermissionIncludeObjectSchema.optional(),
    data: z.union([
      RolePermissionUpdateInputObjectSchema,
      RolePermissionUncheckedUpdateInputObjectSchema,
    ]),
    where: RolePermissionWhereUniqueInputObjectSchema,
  })
  .strict();
