import * as z from "zod";
import type { Prisma } from "../../../../node_modules/.prisma/client";
import { PermissionWhereInputObjectSchema } from "./objects/PermissionWhereInput.schema";

export const PermissionDeleteManySchema: z.ZodType<Prisma.PermissionDeleteManyArgs> =
  z
    .object({ where: PermissionWhereInputObjectSchema.optional() })
    .strict() as unknown as z.ZodType<Prisma.PermissionDeleteManyArgs>;

export const PermissionDeleteManyZodSchema = z
  .object({ where: PermissionWhereInputObjectSchema.optional() })
  .strict();
