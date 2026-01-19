import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantSelectObjectSchema } from "./objects/TenantSelect.schema";
import { TenantUpdateManyMutationInputObjectSchema } from "./objects/TenantUpdateManyMutationInput.schema";
import { TenantWhereInputObjectSchema } from "./objects/TenantWhereInput.schema";

export const TenantUpdateManyAndReturnSchema: z.ZodType<Prisma.TenantUpdateManyAndReturnArgs> =
  z
    .object({
      select: TenantSelectObjectSchema.optional(),
      data: TenantUpdateManyMutationInputObjectSchema,
      where: TenantWhereInputObjectSchema.optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TenantUpdateManyAndReturnArgs>;

export const TenantUpdateManyAndReturnZodSchema = z
  .object({
    select: TenantSelectObjectSchema.optional(),
    data: TenantUpdateManyMutationInputObjectSchema,
    where: TenantWhereInputObjectSchema.optional(),
  })
  .strict();
