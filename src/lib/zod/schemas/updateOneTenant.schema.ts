import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantIncludeObjectSchema } from "./objects/TenantInclude.schema";
import { TenantSelectObjectSchema } from "./objects/TenantSelect.schema";
import { TenantUncheckedUpdateInputObjectSchema } from "./objects/TenantUncheckedUpdateInput.schema";
import { TenantUpdateInputObjectSchema } from "./objects/TenantUpdateInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./objects/TenantWhereUniqueInput.schema";

export const TenantUpdateOneSchema: z.ZodType<Prisma.TenantUpdateArgs> = z
  .object({
    select: TenantSelectObjectSchema.optional(),
    include: TenantIncludeObjectSchema.optional(),
    data: z.union([
      TenantUpdateInputObjectSchema,
      TenantUncheckedUpdateInputObjectSchema,
    ]),
    where: TenantWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.TenantUpdateArgs>;

export const TenantUpdateOneZodSchema = z
  .object({
    select: TenantSelectObjectSchema.optional(),
    include: TenantIncludeObjectSchema.optional(),
    data: z.union([
      TenantUpdateInputObjectSchema,
      TenantUncheckedUpdateInputObjectSchema,
    ]),
    where: TenantWhereUniqueInputObjectSchema,
  })
  .strict();
