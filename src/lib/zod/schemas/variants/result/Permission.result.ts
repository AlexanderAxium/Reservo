import * as z from "zod";
import { PermissionActionSchema } from "../../enums/PermissionAction.schema";
import { PermissionResourceSchema } from "../../enums/PermissionResource.schema";
// prettier-ignore
export const PermissionResultSchema = z
  .object({
    id: z.string(),
    action: PermissionActionSchema,
    resource: PermissionResourceSchema,
    description: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tenantId: z.string(),
    tenant: z.unknown(),
    rolePermissions: z.array(z.unknown()),
  })
  .strict();

export type PermissionResultType = z.infer<typeof PermissionResultSchema>;
