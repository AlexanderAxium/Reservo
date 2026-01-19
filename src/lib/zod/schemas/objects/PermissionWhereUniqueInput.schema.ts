import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionResourceTenantIdCompoundUniqueInputObjectSchema } from "./PermissionActionResourceTenantIdCompoundUniqueInput.schema";

const makeSchema = () =>
  z
    .object({
      id: z.string().optional(),
      action_resource_tenantId: z
        .lazy(
          () => PermissionActionResourceTenantIdCompoundUniqueInputObjectSchema
        )
        .optional(),
    })
    .strict();
export const PermissionWhereUniqueInputObjectSchema: z.ZodType<Prisma.PermissionWhereUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionWhereUniqueInput>;
export const PermissionWhereUniqueInputObjectZodSchema = makeSchema();
