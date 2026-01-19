import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleWhereInputObjectSchema } from "./RoleWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      every: z.lazy(() => RoleWhereInputObjectSchema).optional(),
      some: z.lazy(() => RoleWhereInputObjectSchema).optional(),
      none: z.lazy(() => RoleWhereInputObjectSchema).optional(),
    })
    .strict();
export const RoleListRelationFilterObjectSchema: z.ZodType<Prisma.RoleListRelationFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleListRelationFilter>;
export const RoleListRelationFilterObjectZodSchema = makeSchema();
