import {
  DEFAULT_ROLES,
  PermissionAction,
  type PermissionCheck,
  PermissionResource,
} from "@/types/rbac";
import {
  createAnyRoleMiddleware,
  createMultiPermissionMiddleware,
  createPermissionMiddleware,
  createRoleMiddleware,
} from "./authBase";

/**
 * RBAC middleware for Next.js API routes
 */
export function requirePermission(
  action: PermissionAction,
  resource: PermissionResource
) {
  return createPermissionMiddleware(action, resource);
}

/**
 * Require any of the specified permissions
 */
export function requireAnyPermission(permissionChecks: PermissionCheck[]) {
  return createMultiPermissionMiddleware(permissionChecks, false);
}

/**
 * Require all of the specified permissions
 */
export function requireAllPermissions(permissionChecks: PermissionCheck[]) {
  return createMultiPermissionMiddleware(permissionChecks, true);
}

/**
 * Require specific role
 */
export function requireRole(roleName: string) {
  return createRoleMiddleware(roleName);
}

/**
 * Require any of the specified roles
 */
export function requireAnyRole(roleNames: string[]) {
  return createAnyRoleMiddleware(roleNames);
}

/**
 * Require system admin access (SYS_ADMIN)
 */
export function requireSysAdmin() {
  return requireRole(DEFAULT_ROLES.SYS_ADMIN);
}

/**
 * Require tenant admin access (TENANT_ADMIN)
 */
export function requireTenantAdmin() {
  return requireAnyRole([DEFAULT_ROLES.SYS_ADMIN, DEFAULT_ROLES.TENANT_ADMIN]);
}

/**
 * Require tenant staff access (TENANT_STAFF or higher)
 */
export function requireTenantStaff() {
  return requireAnyRole([
    DEFAULT_ROLES.SYS_ADMIN,
    DEFAULT_ROLES.TENANT_ADMIN,
    DEFAULT_ROLES.TENANT_STAFF,
  ]);
}

/**
 * Require tenant member access (TENANT_ADMIN or TENANT_STAFF)
 */
export function requireTenantMember() {
  return requireAnyRole([
    DEFAULT_ROLES.SYS_ADMIN,
    DEFAULT_ROLES.TENANT_ADMIN,
    DEFAULT_ROLES.TENANT_STAFF,
  ]);
}

/**
 * @deprecated Use requireTenantAdmin instead
 */
export function requireAdmin() {
  return requireTenantAdmin();
}

/**
 * @deprecated Use requireSysAdmin instead
 */
export function requireSuperAdmin() {
  return requireSysAdmin();
}

/**
 * Require user management permissions
 */
export function requireUserManagement() {
  return requirePermission(PermissionAction.MANAGE, PermissionResource.USER);
}

/**
 * Require role management permissions
 */
export function requireRoleManagement() {
  return requirePermission(PermissionAction.MANAGE, PermissionResource.ROLE);
}

/**
 * Require dashboard access
 */
export function requireDashboardAccess() {
  return requirePermission(PermissionAction.READ, PermissionResource.DASHBOARD);
}
