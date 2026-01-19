import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionIncludeObjectSchema } from "./objects/PermissionInclude.schema";
import { PermissionSelectObjectSchema } from "./objects/PermissionSelect.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./objects/PermissionWhereUniqueInput.schema";

export const PermissionFindUniqueSchema: z.ZodType<Prisma.PermissionFindUniqueArgs> =
  z
    .object({
      select: PermissionSelectObjectSchema.optional(),
      include: PermissionIncludeObjectSchema.optional(),
      where: PermissionWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionFindUniqueArgs>;

export const PermissionFindUniqueZodSchema = z
  .object({
    select: PermissionSelectObjectSchema.optional(),
    include: PermissionIncludeObjectSchema.optional(),
    where: PermissionWhereUniqueInputObjectSchema,
  })
  .strict();
