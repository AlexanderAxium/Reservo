import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RoleIncludeObjectSchema } from "./objects/RoleInclude.schema";
import { RoleSelectObjectSchema } from "./objects/RoleSelect.schema";
import { RoleUncheckedUpdateInputObjectSchema } from "./objects/RoleUncheckedUpdateInput.schema";
import { RoleUpdateInputObjectSchema } from "./objects/RoleUpdateInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./objects/RoleWhereUniqueInput.schema";

export const RoleUpdateOneSchema: z.ZodType<Prisma.RoleUpdateArgs> = z
  .object({
    select: RoleSelectObjectSchema.optional(),
    include: RoleIncludeObjectSchema.optional(),
    data: z.union([
      RoleUpdateInputObjectSchema,
      RoleUncheckedUpdateInputObjectSchema,
    ]),
    where: RoleWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.RoleUpdateArgs>;

export const RoleUpdateOneZodSchema = z
  .object({
    select: RoleSelectObjectSchema.optional(),
    include: RoleIncludeObjectSchema.optional(),
    data: z.union([
      RoleUpdateInputObjectSchema,
      RoleUncheckedUpdateInputObjectSchema,
    ]),
    where: RoleWhereUniqueInputObjectSchema,
  })
  .strict();
