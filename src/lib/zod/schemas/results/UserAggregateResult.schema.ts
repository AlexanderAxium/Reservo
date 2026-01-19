import * as z from "zod";
export const UserAggregateResultSchema = z.object({
  _count: z
    .object({
      id: z.number(),
      name: z.number(),
      email: z.number(),
      emailVerified: z.number(),
      image: z.number(),
      createdAt: z.number(),
      updatedAt: z.number(),
      phone: z.number(),
      language: z.number(),
      theme: z.number(),
      tenantId: z.number(),
      accounts: z.number(),
      sessions: z.number(),
      tenant: z.number(),
      userRoles: z.number(),
    })
    .optional(),
  _min: z
    .object({
      id: z.string().nullable(),
      name: z.string().nullable(),
      email: z.string().nullable(),
      image: z.string().nullable(),
      createdAt: z.date().nullable(),
      updatedAt: z.date().nullable(),
      phone: z.string().nullable(),
      tenantId: z.string().nullable(),
    })
    .nullable()
    .optional(),
  _max: z
    .object({
      id: z.string().nullable(),
      name: z.string().nullable(),
      email: z.string().nullable(),
      image: z.string().nullable(),
      createdAt: z.date().nullable(),
      updatedAt: z.date().nullable(),
      phone: z.string().nullable(),
      tenantId: z.string().nullable(),
    })
    .nullable()
    .optional(),
});
