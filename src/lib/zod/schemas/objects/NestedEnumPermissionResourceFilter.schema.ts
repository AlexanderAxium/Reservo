import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";

const nestedenumpermissionresourcefilterSchema = z
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
export const NestedEnumPermissionResourceFilterObjectSchema: z.ZodType<Prisma.NestedEnumPermissionResourceFilter> =
  nestedenumpermissionresourcefilterSchema as unknown as z.ZodType<Prisma.NestedEnumPermissionResourceFilter>;
export const NestedEnumPermissionResourceFilterObjectZodSchema =
  nestedenumpermissionresourcefilterSchema;
