import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RoleCreateInputObjectSchema } from "./objects/RoleCreateInput.schema";
import { RoleIncludeObjectSchema } from "./objects/RoleInclude.schema";
import { RoleSelectObjectSchema } from "./objects/RoleSelect.schema";
import { RoleUncheckedCreateInputObjectSchema } from "./objects/RoleUncheckedCreateInput.schema";
import { RoleUncheckedUpdateInputObjectSchema } from "./objects/RoleUncheckedUpdateInput.schema";
import { RoleUpdateInputObjectSchema } from "./objects/RoleUpdateInput.schema";
import { RoleWhereUniqueInputObjectSchema } from "./objects/RoleWhereUniqueInput.schema";

export const RoleUpsertOneSchema: z.ZodType<Prisma.RoleUpsertArgs> = z
  .object({
    select: RoleSelectObjectSchema.optional(),
    include: RoleIncludeObjectSchema.optional(),
    where: RoleWhereUniqueInputObjectSchema,
    create: z.union([
      RoleCreateInputObjectSchema,
      RoleUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      RoleUpdateInputObjectSchema,
      RoleUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict() as unknown as z.ZodType<Prisma.RoleUpsertArgs>;

export const RoleUpsertOneZodSchema = z
  .object({
    select: RoleSelectObjectSchema.optional(),
    include: RoleIncludeObjectSchema.optional(),
    where: RoleWhereUniqueInputObjectSchema,
    create: z.union([
      RoleCreateInputObjectSchema,
      RoleUncheckedCreateInputObjectSchema,
    ]),
    update: z.union([
      RoleUpdateInputObjectSchema,
      RoleUncheckedUpdateInputObjectSchema,
    ]),
  })
  .strict();
