import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionIncludeObjectSchema } from "./objects/PermissionInclude.schema";
import { PermissionSelectObjectSchema } from "./objects/PermissionSelect.schema";
import { PermissionWhereUniqueInputObjectSchema } from "./objects/PermissionWhereUniqueInput.schema";

export const PermissionFindUniqueOrThrowSchema: z.ZodType<Prisma.PermissionFindUniqueOrThrowArgs> =
  z
    .object({
      select: PermissionSelectObjectSchema.optional(),
      include: PermissionIncludeObjectSchema.optional(),
      where: PermissionWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.PermissionFindUniqueOrThrowArgs>;

export const PermissionFindUniqueOrThrowZodSchema = z
  .object({
    select: PermissionSelectObjectSchema.optional(),
    include: PermissionIncludeObjectSchema.optional(),
    where: PermissionWhereUniqueInputObjectSchema,
  })
  .strict();
