import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantCreateInputObjectSchema } from "./objects/TenantCreateInput.schema";
import { TenantIncludeObjectSchema } from "./objects/TenantInclude.schema";
import { TenantSelectObjectSchema } from "./objects/TenantSelect.schema";
import { TenantUncheckedCreateInputObjectSchema } from "./objects/TenantUncheckedCreateInput.schema";

export const TenantCreateOneSchema: z.ZodType<Prisma.TenantCreateArgs> = z
  .object({
    select: TenantSelectObjectSchema.optional(),
    include: TenantIncludeObjectSchema.optional(),
    data: z.union([
      TenantCreateInputObjectSchema,
      TenantUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.TenantCreateArgs>;

export const TenantCreateOneZodSchema = z
  .object({
    select: TenantSelectObjectSchema.optional(),
    include: TenantIncludeObjectSchema.optional(),
    data: z.union([
      TenantCreateInputObjectSchema,
      TenantUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
