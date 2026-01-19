import * as z from "zod";
import type { Prisma } from "../../../../../node_modules/.prisma/client";
import { PermissionActionSchema } from "../enums/PermissionAction.schema";
import { PermissionResourceSchema } from "../enums/PermissionResource.schema";

const makeSchema = () =>
  z
    .object({
      action: PermissionActionSchema,
      resource: PermissionResourceSchema,
      tenantId: z.string(),
    })
    .strict();
export const PermissionActionResourceTenantIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.PermissionActionResourceTenantIdCompoundUniqueInput> =
  makeSchema() as unknown as z.ZodType<Prisma.PermissionActionResourceTenantIdCompoundUniqueInput>;
export const PermissionActionResourceTenantIdCompoundUniqueInputObjectZodSchema =
  makeSchema();
