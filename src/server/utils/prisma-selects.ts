/**
 * Shared Prisma select/include objects to avoid duplication across routers.
 */

export const fieldSelectBasic = {
  id: true,
  name: true,
  sport: true,
  address: true,
  department: true,
  district: true,
} as const;

export const userSelectBasic = {
  id: true,
  name: true,
  email: true,
} as const;

export const ownerSelectBasic = {
  id: true,
  name: true,
  email: true,
} as const;
