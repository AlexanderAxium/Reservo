import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionCreateInputObjectSchema } from "./objects/PermissionCreateInput.schema";
import { PermissionIncludeObjectSchema } from "./objects/PermissionInclude.schema";
import { PermissionSelectObjectSchema } from "./objects/PermissionSelect.schema";
import { PermissionUncheckedCreateInputObjectSchema } from "./objects/PermissionUncheckedCreateInput.schema";
import { PermissionUncheckedUpdateInputObjectSchema } from "./objects/PermissionUncheckedUpdateInput.schema";
import { PermissionUpdateInputObjectSchema } from "./objects/PermissionUpdateInput.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./objects/PermissionWhereUniqueInput.schema";

export const PermissionUpsertOneSchema: z.ZodType<Prisma.PermissionUpsertArgs> =
  z
    .object({
      select: PermissionSelectObjectSchema.optional(),
      include: PermissionIncludeObjectSchema.optional(),
      where: PermissionWhereUniqueInputObjectSchema,
      create: z.union([
        PermissionCreateInputObjectSchema,
        PermissionUncheckedCreateInputObjectSchema,
      ]),
      update: z.union([
        PermissionUpdateInputObjectSchema,
        PermissionUncheckedUpdateInputObjectSchema,
      ]),
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionUpsertArgs>;

export const PermissionUpsertOneZodSchema = z
  .object({
    select: PermissionSelectObjectSchema.optional(),
    include: PermissionIncludeObjectSchema.optional(),
    where: PermissionWhereUniqueInputObjectSchema,
    create: z.union([
      PermissionCreateInputObjectSchema,
      PermissionUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      PermissionUpdateInputObjectSchema,
      PermissionUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();
