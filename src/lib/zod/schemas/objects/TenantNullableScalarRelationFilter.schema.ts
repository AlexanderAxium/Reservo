import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantWhereInputObjectSchema } from "./TenantWhereInput.schema";

const makeSchema = () =>
  z
    .object({
      is: z
        .lazy(() => TenantWhereInputObjectSchema)
        .optional()
        .nullable(),
      isNot: z
        .lazy(() => TenantWhereInputObjectSchema)
        .optional()
        .nullable(),
    })
    .strict();
export const TenantNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TenantNullableScalarRelationFilter> =
  makeSchema() as unknown as z.ZodType<Prisma.TenantNullableScalarRelationFilter>;
export const TenantNullableScalarRelationFilterObjectZodSchema = makeSchema();
