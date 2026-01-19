import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";
import { NestedEnumPermissionResourceFilterObjectSchema } from "./NestedEnumPermissionResourceFilter.schema";

const makeSchema = () =>
  z
    .object({
      equals: PermissionResourceSchema.optional(),
      in: PermissionResourceSchema.array().optional(),
      notIn: PermissionResourceSchema.array().optional(),
      not: z
        .union([
          PermissionResourceSchema,
          z.lazy(() => NestedEnumPermissionResourceFilterObjectSchema),
        ])
        .optional(),
    })
    .strict();
export const EnumPermissionResourceFilterObjectSchema: z.ZodType<Prisma.EnumPermissionResourceFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.EnumPermissionResourceFilter>;
export const EnumPermissionResourceFilterObjectZodSchema = makeSchema();
