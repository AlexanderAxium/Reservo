import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionCreateManyInputObjectSchema } from "./objects/RolePermissionCreateManyInput.schema";
import { RolePermissionSelectObjectSchema } from "./objects/RolePermissionSelect.schema";

export const RolePermissionCreateManyAndReturnSchema: z.ZodType<Prisma.RolePermissionCreateManyAndReturnArgs> =
  z
    .object({
      select: RolePermissionSelectObjectSchema.optional(),
      data: z.union([
        RolePermissionCreateManyInputObjectSchema,
        z.array(RolePermissionCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionCreateManyAndReturnArgs>;

export const RolePermissionCreateManyAndReturnZodSchema = z
  .object({
    select: RolePermissionSelectObjectSchema.optional(),
    data: z.union([
      RolePermissionCreateManyInputObjectSchema,
      z.array(RolePermissionCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
