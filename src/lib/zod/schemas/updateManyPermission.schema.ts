import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionUpdateManyMutationInputObjectSchema } from "./objects/PermissionUpdateManyMutationInput.schema";
import { PermissionWhereInputObjectSchema } from "./objects/PermissionWhereInput.schema";

export const PermissionUpdateManySchema: z.ZodType<Prisma.PermissionUpdateManyArgs> =
  z
    .object({
      data: PermissionUpdateManyMutationInputObjectSchema,
      where: PermissionWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionUpdateManyArgs>;

export const PermissionUpdateManyZodSchema = z
  .object({
    data: PermissionUpdateManyMutationInputObjectSchema,
    where: PermissionWhereInputObjectSchema.optional(),
  })
  .strict();
