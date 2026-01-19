import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionCreateInputObjectSchema } from "./objects/RolePermissionCreateInput.schema";
import { RolePermissionIncludeObjectSchema } from "./objects/RolePermissionInclude.schema";
import { RolePermissionSelectObjectSchema } from "./objects/RolePermissionSelect.schema";
import { RolePermissionUncheckedCreateInputObjectSchema } from "./objects/RolePermissionUncheckedCreateInput.schema";

export const RolePermissionCreateOneSchema: z.ZodType<Prisma.RolePermissionCreateArgs> =
  z
    .object({
      select: RolePermissionSelectObjectSchema.optional(),
      include: RolePermissionIncludeObjectSchema.optional(),
      data: z.union([
        RolePermissionCreateInputObjectSchema,
        RolePermissionUncheckedCreateInputObjectSchema,
      ]),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionCreateArgs>;

export const RolePermissionCreateOneZodSchema = z
  .object({
    select: RolePermissionSelectObjectSchema.optional(),
    include: RolePermissionIncludeObjectSchema.optional(),
    data: z.union([
      RolePermissionCreateInputObjectSchema,
      RolePermissionUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
