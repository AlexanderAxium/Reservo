import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RoleCreateInputObjectSchema } from "./objects/RoleCreateInput.schema";
import { RoleIncludeObjectSchema } from "./objects/RoleInclude.schema";
import { RoleSelectObjectSchema } from "./objects/RoleSelect.schema";
import { RoleUncheckedCreateInputObjectSchema } from "./objects/RoleUncheckedCreateInput.schema";

export const RoleCreateOneSchema: z.ZodType<Prisma.RoleCreateArgs> = z
  .object({
    select: RoleSelectObjectSchema.optional(),
    include: RoleIncludeObjectSchema.optional(),
    data: z.union([
      RoleCreateInputObjectSchema,
      RoleUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.RoleCreateArgs>;

export const RoleCreateOneZodSchema = z
  .object({
    select: RoleSelectObjectSchema.optional(),
    include: RoleIncludeObjectSchema.optional(),
    data: z.union([
      RoleCreateInputObjectSchema,
      RoleUncheckedCreateInputObjectSchema,
    ]),
  })
  .strict();
