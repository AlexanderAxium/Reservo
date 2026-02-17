import type { UserRole } from "@/hooks/useUser";
import { DEFAULT_ROLES } from "@/types/rbac";

/**
 * Returns the default panel route for a given role.
 */
export function getDefaultRoute(primaryRole: UserRole | string): string {
  switch (primaryRole) {
    case DEFAULT_ROLES.SYS_ADMIN:
      return "/system";
    case DEFAULT_ROLES.TENANT_ADMIN:
    case DEFAULT_ROLES.TENANT_STAFF:
      return "/dashboard";
    case DEFAULT_ROLES.CLIENT:
      return "/my";
    default:
      return "/";
  }
}
