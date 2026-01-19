import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantWhereInputObjectSchema } from "./objects/TenantWhereInput.schema";

export const TenantDeleteManySchema: z.ZodType<Prisma.TenantDeleteManyArgs> = z
  .object({ where: TenantWhereInputObjectSchema.optional() })
  .strict() as unknown as z.ZodType<Prisma.TenantDeleteManyArgs>;

export const TenantDeleteManyZodSchema = z
  .object({ where: TenantWhereInputObjectSchema.optional() })
  .strict();
