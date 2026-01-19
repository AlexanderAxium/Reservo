import * as z from "zod";
export const RolePermissionGroupByResultSchema = z.array(
  z.object({
    id: z.string(),
    roleId: z.string(),
    permissionId: z.string(),
    createdAt: z.date(),
    _count: z
      .object({
        id: z.number(),
        roleId: z.number(),
        permissionId: z.number(),
        createdAt: z.number(),
        permission: z.number(),
        role: z.number(),
      })
      .optional(),
    _min: z
      .object({
        id: z.string().nullable(),
        roleId: z.string().nullable(),
        permissionId: z.string().nullable(),
        createdAt: z.date().nullable(),
      })
      .nullable()
      .optional(),
    _max: z
      .object({
        id: z.string().nullable(),
        roleId: z.string().nullable(),
        permissionId: z.string().nullable(),
        createdAt: z.date().nullable(),
      })
      .nullable()
      .optional(),
  })
);
