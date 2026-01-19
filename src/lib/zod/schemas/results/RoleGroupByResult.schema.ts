import * as z from "zod";
export const RoleGroupByResultSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    isSystem: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    tenantId: z.string(),
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
  })
);
