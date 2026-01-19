import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RolePermissionWhereInputObjectSchema } from "./RolePermissionWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      every: z.lazy(() => RolePermissionWhereInputObjectSchema).optional(),
      some: z.lazy(() => RolePermissionWhereInputObjectSchema).optional(),
      none: z.lazy(() => RolePermissionWhereInputObjectSchema).optional(),
    })
    .strict();
export const RolePermissionListRelationFilterObjectSchema: z.ZodType<Prisma.RolePermissionListRelationFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.RolePermissionListRelationFilter>;
export const RolePermissionListRelationFilterObjectZodSchema = makeSchema();
