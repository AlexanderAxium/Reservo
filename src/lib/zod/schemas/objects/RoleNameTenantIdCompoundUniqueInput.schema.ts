import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";

const makeSchema = () =>
  z
    .object({
      name: z.string(),
      tenantId: z.string(),
    })
    .strict();
export const RoleNameTenantIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.RoleNameTenantIdCompoundUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleNameTenantIdCompoundUniqueInput>;
export const RoleNameTenantIdCompoundUniqueInputObjectZodSchema = makeSchema();
