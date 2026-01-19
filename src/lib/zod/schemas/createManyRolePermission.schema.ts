import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionCreateManyInputObjectSchema } from "./objects/RolePermissionCreateManyInput.schema";

export const RolePermissionCreateManySchema: z.ZodType<Prisma.RolePermissionCreateManyArgs> =
  z
    .object({
      data: z.union([
        RolePermissionCreateManyInputObjectSchema,
        z.array(RolePermissionCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionCreateManyArgs>;

export const RolePermissionCreateManyZodSchema = z
  .object({
    data: z.union([
      RolePermissionCreateManyInputObjectSchema,
      z.array(RolePermissionCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
