import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";

const nestedenumpermissionactionfilterSchema = z
  .object({
    equals: PermissionActionSchema.optional(),
    in: PermissionActionSchema.array().optional(),
    notIn: PermissionActionSchema.array().optional(),
    not: z
      .union([
        PermissionActionSchema,
        z.lazy(() => NestedEnumPermissionActionFilterObjectSchema),
      ])
      .optional(),
  })
  .strict();
export const NestedEnumPermissionActionFilterObjectSchema: z.ZodType<Prisma.NestedEnumPermissionActionFilter> =
  nestedenumpermissionactionfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPermissionActionFilter>;
export const NestedEnumPermissionActionFilterObjectZodSchema =
  nestedenumpermissionactionfilterSchema;
