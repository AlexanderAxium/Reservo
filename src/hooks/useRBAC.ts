import { useAuthContext } from "@/AuthContext";
import {
  PermissionAction,
  type PermissionCheck,
  PermissionResource,
} from "@/types/rbac";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";

export function useRBAC() {
  const { user } = useAuthContext();

  // Single query to get all RBAC context
  const { data: rbacContext, isLoading } = trpc.rbac.getRBACContext.useQuery(
    { userId: user?.id || "" },
    {
      enabled: !!user?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      refetchOnWindowFocus: false,
    }
  );

  // Extract data from context with fallbacks
  const userRoles = rbacContext?.userRoles || [];
  const userPermissions = rbacContext?.permissions || [];

  // New role flags
  const isSysAdmin = useMemo(() => {
    if (!userRoles.length) return false;
    return userRoles.some(
      (role) =>
        (role.name === "sys_admin" || role.name === "super_admin") &&
        role.isActive
    );
  }, [userRoles]);

  const isTenantAdmin = useMemo(() => {
    if (!userRoles.length) return false;
    return userRoles.some(
      (role) =>
        (role.name === "tenant_admin" || role.name === "admin") && role.isActive
    );
  }, [userRoles]);

  const isTenantStaff = useMemo(() => {
    if (!userRoles.length) return false;
    return userRoles.some(
      (role) => role.name === "tenant_staff" && role.isActive
    );
  }, [userRoles]);

  const isClient = useMemo(() => {
    if (!userRoles.length) return false;
    return userRoles.some(
      (role) =>
        (role.name === "client" || role.name === "user") && role.isActive
    );
  }, [userRoles]);

  const isTenantMember = useMemo(() => {
    return isTenantAdmin || isTenantStaff;
  }, [isTenantAdmin, isTenantStaff]);

  // Backward compatibility
  const isAdmin = useMemo(() => {
    return isSysAdmin || isTenantAdmin;
  }, [isSysAdmin, isTenantAdmin]);

  const isSuperAdmin = isSysAdmin;

  const canManageUsers = useMemo(() => {
    if (!userPermissions.length) return false;
    return userPermissions.some(
      (permission) =>
        permission.action === PermissionAction.MANAGE &&
        permission.resource === PermissionResource.USER &&
        permission.isActive
    );
  }, [userPermissions]);

  const canManageRoles = useMemo(() => {
    if (!userPermissions.length) return false;
    return userPermissions.some(
      (permission) =>
        permission.action === PermissionAction.MANAGE &&
        permission.resource === PermissionResource.ROLE &&
        permission.isActive
    );
  }, [userPermissions]);

  const canAccessAdmin = useMemo(() => {
    if (!userPermissions.length) return false;
    return userPermissions.some(
      (permission) =>
        permission.action === PermissionAction.MANAGE &&
        permission.resource === PermissionResource.ADMIN &&
        permission.isActive
    );
  }, [userPermissions]);

  const canViewDashboard = useMemo(() => {
    if (!userPermissions.length) return false;
    return userPermissions.some(
      (permission) =>
        permission.action === PermissionAction.READ &&
        permission.resource === PermissionResource.DASHBOARD &&
        permission.isActive
    );
  }, [userPermissions]);

  // Memoized utility functions to prevent unnecessary re-renders
  const utilityFunctions = useMemo(
    () => ({
      hasPermission: (
        action: PermissionAction,
        resource: PermissionResource
      ) => {
        if (!userPermissions.length) return false;
        return userPermissions.some(
          (permission) =>
            permission.action === action &&
            permission.resource === resource &&
            permission.isActive
        );
      },

      hasRole: (roleName: string) => {
        if (!userRoles.length) return false;
        return userRoles.some(
          (role) => role.name === roleName && role.isActive
        );
      },

      hasAnyRole: (roleNames: string[]) => {
        if (!userRoles.length) return false;
        return userRoles.some(
          (role) => roleNames.includes(role.name) && role.isActive
        );
      },

      hasAllRoles: (roleNames: string[]) => {
        if (!userRoles.length) return false;
        return roleNames.every((roleName) =>
          userRoles.some((role) => role.name === roleName && role.isActive)
        );
      },

      hasAnyPermission: (permissionChecks: PermissionCheck[]) => {
        if (!userPermissions.length) return false;
        return permissionChecks.some((check) =>
          userPermissions.some(
            (permission) =>
              permission.action === check.action &&
              permission.resource === check.resource &&
              permission.isActive
          )
        );
      },

      hasAllPermissions: (permissionChecks: PermissionCheck[]) => {
        if (!userPermissions.length) return false;
        return permissionChecks.every((check) =>
          userPermissions.some(
            (permission) =>
              permission.action === check.action &&
              permission.resource === check.resource &&
              permission.isActive
          )
        );
      },
    }),
    [userRoles, userPermissions]
  );

  return {
    // Data
    userRoles,
    userPermissions,

    // New role flags
    isSysAdmin,
    isTenantAdmin,
    isTenantStaff,
    isClient,
    isTenantMember,

    // Backward compatibility
    isAdmin,
    isSuperAdmin,
    canManageUsers,
    canManageRoles,
    canAccessAdmin,
    canViewDashboard,

    // Loading state
    isLoading,

    // Utility functions (memoized)
    ...utilityFunctions,
  };
}
