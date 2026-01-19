import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionIncludeObjectSchema } from "./objects/PermissionInclude.schema";
import { PermissionSelectObjectSchema } from "./objects/PermissionSelect.schema";
import { PermissionUncheckedUpdateInputObjectSchema } from "./objects/PermissionUncheckedUpdateInput.schema";
import { PermissionUpdateInputObjectSchema } from "./objects/PermissionUpdateInput.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./objects/PermissionWhereUniqueInput.schema";

export const PermissionUpdateOneSchema: z.ZodType<Prisma.PermissionUpdateArgs> =
  z
    .object({
      select: PermissionSelectObjectSchema.optional(),
      include: PermissionIncludeObjectSchema.optional(),
      data: z.union([
        PermissionUpdateInputObjectSchema,
        PermissionUncheckedUpdateInputObjectSchema,
      ]),
      where: PermissionWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionUpdateArgs>;

export const PermissionUpdateOneZodSchema = z
  .object({
    select: PermissionSelectObjectSchema.optional(),
    include: PermissionIncludeObjectSchema.optional(),
    data: z.union([
      PermissionUpdateInputObjectSchema,
      PermissionUncheckedUpdateInputObjectSchema,
    ]),
    where: PermissionWhereUniqueInputObjectSchema,
  })
  .strict();
