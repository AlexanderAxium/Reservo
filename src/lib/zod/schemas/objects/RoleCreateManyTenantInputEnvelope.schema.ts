import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleCreateManyTenantInputObjectSchema } from "./RoleCreateManyTenantInput.schema";

const makeSchema = () =>
  z
    .object({
      data: z.union([
        z.lazy(() => RoleCreateManyTenantInputObjectSchema),
        z.lazy(() => RoleCreateManyTenantInputObjectSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();
export const RoleCreateManyTenantInputEnvelopeObjectSchema: z.ZodType<Prisma.RoleCreateManyTenantInputEnvelope> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleCreateManyTenantInputEnvelope>;
export const RoleCreateManyTenantInputEnvelopeObjectZodSchema = makeSchema();
