import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionWhereInputObjectSchema } from "./PermissionWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      every: z.lazy(() => PermissionWhereInputObjectSchema).optional(),
      some: z.lazy(() => PermissionWhereInputObjectSchema).optional(),
      none: z.lazy(() => PermissionWhereInputObjectSchema).optional(),
    })
    .strict();
export const PermissionListRelationFilterObjectSchema: z.ZodType<Prisma.PermissionListRelationFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionListRelationFilter>;
export const PermissionListRelationFilterObjectZodSchema = makeSchema();
