import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantCreateInputObjectSchema } from "./objects/TenantCreateInput.schema";
import { TenantIncludeObjectSchema } from "./objects/TenantInclude.schema";
import { TenantSelectObjectSchema } from "./objects/TenantSelect.schema";
import { TenantUncheckedCreateInputObjectSchema } from "./objects/TenantUncheckedCreateInput.schema";
import { TenantUncheckedUpdateInputObjectSchema } from "./objects/TenantUncheckedUpdateInput.schema";
import { TenantUpdateInputObjectSchema } from "./objects/TenantUpdateInput.schema";
import { TenantWhereUniqueInputObjectSchema } from "./objects/TenantWhereUniqueInput.schema";

export const TenantUpsertOneSchema: z.ZodType<Prisma.TenantUpsertArgs> = z
  .object({
    select: TenantSelectObjectSchema.optional(),
    include: TenantIncludeObjectSchema.optional(),
    where: TenantWhereUniqueInputObjectSchema,
    create: z.union([
      TenantCreateInputObjectSchema,
      TenantUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      TenantUpdateInputObjectSchema,
      TenantUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.TenantUpsertArgs>;

export const TenantUpsertOneZodSchema = z
  .object({
    select: TenantSelectObjectSchema.optional(),
    include: TenantIncludeObjectSchema.optional(),
    where: TenantWhereUniqueInputObjectSchema,
    create: z.union([
      TenantCreateInputObjectSchema,
      TenantUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      TenantUpdateInputObjectSchema,
      TenantUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();
