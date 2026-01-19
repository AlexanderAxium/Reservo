import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantIncludeObjectSchema } from "./objects/TenantInclude.schema";
import { TenantSelectObjectSchema } from "./objects/TenantSelect.schema";
import { TenantWhereUniqueInputObjectSchema } from "./objects/TenantWhereUniqueInput.schema";

export const TenantFindUniqueOrThrowSchema: z.ZodType<Prisma.TenantFindUniqueOrThrowArgs> =
  z
    .object({
      select: TenantSelectObjectSchema.optional(),
      include: TenantIncludeObjectSchema.optional(),
      where: TenantWhereUniqueInputObjectSchema,
    })
    .strict() as unknown as z.ZodType<Prisma.TenantFindUniqueOrThrowArgs>;

export const TenantFindUniqueOrThrowZodSchema = z
  .object({
    select: TenantSelectObjectSchema.optional(),
    include: TenantIncludeObjectSchema.optional(),
    where: TenantWhereUniqueInputObjectSchema,
  })
  .strict();
