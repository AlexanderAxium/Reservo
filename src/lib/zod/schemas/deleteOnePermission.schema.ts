import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionIncludeObjectSchema } from "./objects/PermissionInclude.schema";
import { PermissionSelectObjectSchema } from "./objects/PermissionSelect.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./objects/PermissionWhereUniqueInput.schema";

export const PermissionDeleteOneSchema: z.ZodType<Prisma.PermissionDeleteArgs> =
  z
    .object({
      select: PermissionSelectObjectSchema.optional(),
      include: PermissionIncludeObjectSchema.optional(),
      where: PermissionWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionDeleteArgs>;

export const PermissionDeleteOneZodSchema = z
  .object({
    select: PermissionSelectObjectSchema.optional(),
    include: PermissionIncludeObjectSchema.optional(),
    where: PermissionWhereUniqueInputObjectSchema,
  })
  .strict();
