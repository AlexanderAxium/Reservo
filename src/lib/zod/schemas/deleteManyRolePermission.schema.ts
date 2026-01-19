import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { RolePermissionWhereInputObjectSchema } from "./objects/RolePermissionWhereInput.schema";

export const RolePermissionDeleteManySchema: z.ZodType<Prisma.RolePermissionDeleteManyArgs> =
  z
    .object({ where: RolePermissionWhereInputObjectSchema.optional() })
    .strict() as unknown as z.ZodType<Prisma.RolePermissionDeleteManyArgs>;

export const RolePermissionDeleteManyZodSchema = z
  .object({ where: RolePermissionWhereInputObjectSchema.optional() })
  .strict();
