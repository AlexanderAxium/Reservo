import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionWhereInputObjectSchema } from "./PermissionWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      is: z.lazy(() => PermissionWhereInputObjectSchema).optional(),
      isNot: z.lazy(() => PermissionWhereInputObjectSchema).optional(),
    })
    .strict();
export const PermissionScalarRelationFilterObjectSchema: z.ZodType<Prisma.PermissionScalarRelationFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionScalarRelationFilter>;
export const PermissionScalarRelationFilterObjectZodSchema = makeSchema();
