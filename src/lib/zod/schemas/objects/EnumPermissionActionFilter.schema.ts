import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { NestedEnumPermissionActionFilterObjectSchema } from "./NestedEnumPermissionActionFilter.schema";

const makeSchema = () =>
  z
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
export const EnumPermissionActionFilterObjectSchema: z.ZodType<Prisma.EnumPermissionActionFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumPermissionActionFilter>;
export const EnumPermissionActionFilterObjectZodSchema = makeSchema();
