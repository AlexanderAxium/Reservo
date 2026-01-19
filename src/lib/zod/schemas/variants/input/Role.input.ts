import * as z from "zod";
// prettier-ignore
export const RoleInputSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    description: z.string().optional().nullable(),
    isActive: z.boolean(),
    isSystem: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tenantId: z.string(),
    rolePermissions: z.array(z.unknown()),
    tenant: z.unknown(),
    userRoles: z.array(z.unknown()),
  })
  .strict();

export type RoleInputType = z.infer<typeof RoleInputSchema>;
