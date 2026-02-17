import { DEFAULT_ROLES } from "@/types/rbac";
import { TRPCError } from "@trpc/server";
import { isTenantAdmin, isTenantMember } from "../services/rbacService";
import { t } from "./context";

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Now user is guaranteed to be defined
    },
  });
});

// Tenant staff procedure that requires TENANT_STAFF or higher
export const tenantStaffProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  if (!ctx.user.tenantId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be associated with a tenant to access this resource",
    });
  }

  // sys_admin always passes (roles comes from real tenant, not impersonated)
  const isSys = ctx.user.roles.includes(DEFAULT_ROLES.SYS_ADMIN);

  if (!isSys) {
    const isMember = await isTenantMember(ctx.user.id, ctx.user.tenantId);
    if (!isMember) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must be a tenant staff member to access this resource",
      });
    }
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Tenant admin procedure that requires TENANT_ADMIN role
export const tenantAdminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  if (!ctx.user.tenantId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be associated with a tenant to access this resource",
    });
  }

  // sys_admin always passes (roles comes from real tenant, not impersonated)
  const isSys = ctx.user.roles.includes(DEFAULT_ROLES.SYS_ADMIN);

  if (!isSys) {
    const isAdmin = await isTenantAdmin(ctx.user.id, ctx.user.tenantId);
    if (!isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must be a tenant admin to access this resource",
      });
    }
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// System admin procedure that requires SYS_ADMIN role
export const sysAdminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  // Use ctx.user.roles (always from real tenant, never affected by impersonation)
  if (!ctx.user.roles.includes(DEFAULT_ROLES.SYS_ADMIN)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be a system administrator to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
