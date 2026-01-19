import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionCreateInputObjectSchema } from "./objects/RolePermissionCreateInput.schema";
import { RolePermissionIncludeObjectSchema } from "./objects/RolePermissionInclude.schema";
import { RolePermissionSelectObjectSchema } from "./objects/RolePermissionSelect.schema";
import { RolePermissionUncheckedCreateInputObjectSchema } from "./objects/RolePermissionUncheckedCreateInput.schema";
import { RolePermissionUncheckedUpdateInputObjectSchema } from "./objects/RolePermissionUncheckedUpdateInput.schema";
import { RolePermissionUpdateInputObjectSchema } from "./objects/RolePermissionUpdateInput.schema";
import { RolePermissionWhereUniqueInputObjectSchema } from "./objects/RolePermissionWhereUniqueInput.schema";

export const RolePermissionUpsertOneSchema: z.ZodType<Prisma.RolePermissionUpsertArgs> =
  z
    .object({
      select: RolePermissionSelectObjectSchema.optional(),
      include: RolePermissionIncludeObjectSchema.optional(),
      where: RolePermissionWhereUniqueInputObjectSchema,
      create: z.union([
        RolePermissionCreateInputObjectSchema,
        RolePermissionUncheckedCreateInputObjectSchema,
      ]),
      update: z.union([
        RolePermissionUpdateInputObjectSchema,
        RolePermissionUncheckedUpdateInputObjectSchema,
      ]),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionUpsertArgs>;

export const RolePermissionUpsertOneZodSchema = z
  .object({
    select: RolePermissionSelectObjectSchema.optional(),
    include: RolePermissionIncludeObjectSchema.optional(),
    where: RolePermissionWhereUniqueInputObjectSchema,
    create: z.union([
      RolePermissionCreateInputObjectSchema,
      RolePermissionUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      RolePermissionUpdateInputObjectSchema,
      RolePermissionUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();
