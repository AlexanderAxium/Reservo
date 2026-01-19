import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RoleCreateManyInputObjectSchema } from "./objects/RoleCreateManyInput.schema";
import { RoleSelectObjectSchema } from "./objects/RoleSelect.schema";

export const RoleCreateManyAndReturnSchema: z.ZodType<Prisma.RoleCreateManyAndReturnArgs> =
  z
    .object({
      select: RoleSelectObjectSchema.optional(),
      data: z.union([
        RoleCreateManyInputObjectSchema,
        z.array(RoleCreateManyInputObjectSchema),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict() as unknown as z.ZodType<Prisma.RoleCreateManyAndReturnArgs>;

export const RoleCreateManyAndReturnZodSchema = z
  .object({
    select: RoleSelectObjectSchema.optional(),
    data: z.union([
      RoleCreateManyInputObjectSchema,
      z.array(RoleCreateManyInputObjectSchema),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();
