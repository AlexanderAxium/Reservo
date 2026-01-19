import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionCreateInputObjectSchema } from "./objects/PermissionCreateInput.schema";
import { PermissionIncludeObjectSchema } from "./objects/PermissionInclude.schema";
import { PermissionSelectObjectSchema } from "./objects/PermissionSelect.schema";
import { PermissionUncheckedCreateInputObjectSchema } from "./objects/PermissionUncheckedCreateInput.schema";

export const PermissionCreateOneSchema: z.ZodType<Prisma.PermissionCreateArgs> =
  z
    .object({
      select: PermissionSelectObjectSchema.optional(),
      include: PermissionIncludeObjectSchema.optional(),
      data: z.union([
        PermissionCreateInputObjectSchema,
        PermissionUncheckedCreateInputObjectSchema,
      ]),
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionCreateArgs>;

export const PermissionCreateOneZodSchema = z
  .object({
    select: PermissionSelectObjectSchema.optional(),
    include: PermissionIncludeObjectSchema.optional(),
    data: z.union([
      PermissionCreateInputObjectSchema,
      PermissionUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
