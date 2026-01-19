import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionCreateManyTenantInputObjectSchema } from "./PermissionCreateManyTenantInput.schema";

const makeSchema = () =>
  z
    .object({
      data: z.union([
        z.lazy(() => PermissionCreateManyTenantInputObjectSchema),
        z.lazy(() => PermissionCreateManyTenantInputObjectSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();
export const PermissionCreateManyTenantInputEnvelopeObjectSchema: z.ZodType<Prisma.PermissionCreateManyTenantInputEnvelope> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionCreateManyTenantInputEnvelope>;
export const PermissionCreateManyTenantInputEnvelopeObjectZodSchema =
  makeSchema();
