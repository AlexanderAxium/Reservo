import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantUpdateManyMutationInputObjectSchema } from "./objects/TenantUpdateManyMutationInput.schema";
import { TenantWhereInputObjectSchema } from "./objects/TenantWhereInput.schema";

export const TenantUpdateManySchema: z.ZodType<Prisma.TenantUpdateManyArgs> = z
  .object({
    data: TenantUpdateManyMutationInputObjectSchema,
    where: TenantWhereInputObjectSchema.optional(),
  })
  .strict() as unknown as z.ZodType<Prisma.TenantUpdateManyArgs>;

export const TenantUpdateManyZodSchema = z
  .object({
    data: TenantUpdateManyMutationInputObjectSchema,
    where: TenantWhereInputObjectSchema.optional(),
  })
  .strict();
