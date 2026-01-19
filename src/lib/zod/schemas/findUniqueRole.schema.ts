import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RoleIncludeObjectSchema } from "./objects/RoleInclude.schema";
import { RoleSelectObjectSchema } from "./objects/RoleSelect.schema";
import { RoleWhereUniqueInputObjectSchema } from "./objects/RoleWhereUniqueInput.schema";

export const RoleFindUniqueSchema: z.ZodType<Prisma.RoleFindUniqueArgs> = z
  .object({
    select: RoleSelectObjectSchema.optional(),
    include: RoleIncludeObjectSchema.optional(),
    where: RoleWhereUniqueInputObjectSchema,
  })
  .strict() as unknown as z.ZodType<Prisma.RoleFindUniqueArgs>;

export const RoleFindUniqueZodSchema = z
  .object({
    select: RoleSelectObjectSchema.optional(),
    include: RoleIncludeObjectSchema.optional(),
    where: RoleWhereUniqueInputObjectSchema,
  })
  .strict();
