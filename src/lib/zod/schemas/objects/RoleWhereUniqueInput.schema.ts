import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { RoleNameTenantIdCompoundUniqueInputObjectSchema } from "./RoleNameTenantIdCompoundUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      name_tenantId: z
        .lazy(() => RoleNameTenantIdCompoundUniqueInputObjectSchema)
        .optional(),
    })
    .strict();
export const RoleWhereUniqueInputObjectSchema: z.ZodType<Prisma.RoleWhereUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.RoleWhereUniqueInput>;
export const RoleWhereUniqueInputObjectZodSchema = makeSchema();
