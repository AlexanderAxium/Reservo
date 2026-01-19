import * as z from "zod";
export const UserCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  phone: z.string().optional(),
  language: z.unknown(),
  theme: z.unknown(),
  tenantId: z.string().optional(),
  accounts: z.array(z.unknown()),
  sessions: z.array(z.unknown()),
  tenant: z.unknown().optional(),
  userRoles: z.array(z.unknown()),
});
