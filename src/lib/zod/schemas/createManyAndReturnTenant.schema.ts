import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { TenantCreateManyInputObjectSchema } from "./objects/TenantCreateManyInput.schema";
import { TenantSelectObjectSchema } from "./objects/TenantSelect.schema";

export const TenantCreateManyAndReturnSchema: z.ZodType<Prisma.TenantCreateManyAndReturnArgs> =
  z
    .object({
      select: TenantSelectObjectSchema.optional(),
      data: z.union([
        TenantCreateManyInputObjectSchema,
        z.array(TenantCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.TenantCreateManyAndReturnArgs>;

export const TenantCreateManyAndReturnZodSchema = z
  .object({
    select: TenantSelectObjectSchema.optional(),
    data: z.union([
      TenantCreateManyInputObjectSchema,
      z.array(TenantCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
