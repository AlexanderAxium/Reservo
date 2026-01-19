import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionCreateManyInputObjectSchema } from "./objects/PermissionCreateManyInput.schema";

export const PermissionCreateManySchema: z.ZodType<Prisma.PermissionCreateManyArgs> =
  z
    .object({
      data: z.union([
        PermissionCreateManyInputObjectSchema,
        z.array(PermissionCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionCreateManyArgs>;

export const PermissionCreateManyZodSchema = z
  .object({
    data: z.union([
      PermissionCreateManyInputObjectSchema,
      z.array(PermissionCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
