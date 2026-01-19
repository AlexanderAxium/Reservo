import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      is: z.lazy(() => TenantWhereInputObjectSchema).optional(),
      isNot: z.lazy(() => TenantWhereInputObjectSchema).optional(),
    })
    .strict();
export const TenantScalarRelationFilterObjectSchema: z.ZodType<Prisma.TenantScalarRelationFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantScalarRelationFilter>;
export const TenantScalarRelationFilterObjectZodSchema = makeSchema();
