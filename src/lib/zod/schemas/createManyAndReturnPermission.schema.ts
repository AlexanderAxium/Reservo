import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionCreateManyInputObjectSchema } from "./objects/PermissionCreateManyInput.schema";
import { PermissionSelectObjectSchema } from "./objects/PermissionSelect.schema";

export const PermissionCreateManyAndReturnSchema: z.ZodType<Prisma.PermissionCreateManyAndReturnArgs> =
  z
    .object({
      select: PermissionSelectObjectSchema.optional(),
      data: z.union([
        PermissionCreateManyInputObjectSchema,
        z.array(PermissionCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionCreateManyAndReturnArgs>;

export const PermissionCreateManyAndReturnZodSchema = z
  .object({
    select: PermissionSelectObjectSchema.optional(),
    data: z.union([
      PermissionCreateManyInputObjectSchema,
      z.array(PermissionCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
