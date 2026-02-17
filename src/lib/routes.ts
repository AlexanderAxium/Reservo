import type { UserRole } from "@/hooks/useUser";

/**
 * Returns the default panel route for a given role.
 */
export function getDefaultRoute(primaryRole: UserRole | string): string {
  switch (primaryRole) {
    case "sys_admin":
      return "/system";
    case "tenant_admin":
    case "tenant_staff":
      return "/dashboard";
    case "client":
      return "/my";
    default:
      return "/";
  }
}
