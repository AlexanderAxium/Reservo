import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionSelectObjectSchema } from "./objects/PermissionSelect.schema";
import { PermissionUpdateManyMutationInputObjectSchema } from "./objects/PermissionUpdateManyMutationInput.schema";
import { PermissionWhereInputObjectSchema } from "./objects/PermissionWhereInput.schema";

export const PermissionUpdateManyAndReturnSchema: z.ZodType<Prisma.PermissionUpdateManyAndReturnArgs> =
  z
    .object({
      select: PermissionSelectObjectSchema.optional(),
      data: PermissionUpdateManyMutationInputObjectSchema,
      where: PermissionWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionUpdateManyAndReturnArgs>;

export const PermissionUpdateManyAndReturnZodSchema = z
  .object({
    select: PermissionSelectObjectSchema.optional(),
    data: PermissionUpdateManyMutationInputObjectSchema,
    where: PermissionWhereInputObjectSchema.optional(),
  })
  .strict();
