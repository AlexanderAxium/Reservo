import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { TenantIncludeObjectSchema } from "./TenantInclude.schema";
import { TenantSelectObjectSchema } from "./TenantSelect.schema";

const makeSchema = () =>
  z
    .object({
      select: z.lazy(() => TenantSelectObjectSchema).optional(),
      include: z.lazy(() => TenantIncludeObjectSchema).optional(),
    })
    .strict();
export const TenantArgsObjectSchema = makeSchema();
export const TenantArgsObjectZodSchema = makeSchema();
