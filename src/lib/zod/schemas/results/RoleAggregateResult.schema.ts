import * as z from "zod";
export const RoleAggregateResultSchema = z.object({
  _count: z
    .object({
      id: z.number(),
      name: z.number(),
      displayName: z.number(),
      description: z.number(),
      isActive: z.number(),
      isSystem: z.number(),
      createdAt: z.number(),
      updatedAt: z.number(),
      tenantId: z.number(),
      rolePermissions: z.number(),
      tenant: z.number(),
      userRoles: z.number(),
    })
    .optional(),
  _min: z
    .object({
      id: z.string().nullable(),
      name: z.string().nullable(),
      displayName: z.string().nullable(),
      description: z.string().nullable(),
      createdAt: z.date().nullable(),
      updatedAt: z.date().nullable(),
      tenantId: z.string().nullable(),
    })
    .nullable()
    .optional(),
  _max: z
    .object({
      id: z.string().nullable(),
      name: z.string().nullable(),
      displayName: z.string().nullable(),
      description: z.string().nullable(),
      createdAt: z.date().nullable(),
      updatedAt: z.date().nullable(),
      tenantId: z.string().nullable(),
    })
    .nullable()
    .optional(),
});
