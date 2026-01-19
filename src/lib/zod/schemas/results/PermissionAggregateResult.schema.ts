import * as z from "zod";
export const PermissionAggregateResultSchema = z.object({
  _count: z
    .object({
      id: z.number(),
      action: z.number(),
      resource: z.number(),
      description: z.number(),
      isActive: z.number(),
      createdAt: z.number(),
      updatedAt: z.number(),
      tenantId: z.number(),
      tenant: z.number(),
      rolePermissions: z.number(),
    })
    .optional(),
  _min: z
    .object({
      id: z.string().nullable(),
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
      description: z.string().nullable(),
      createdAt: z.date().nullable(),
      updatedAt: z.date().nullable(),
      tenantId: z.string().nullable(),
    })
    .nullable()
    .optional(),
});
