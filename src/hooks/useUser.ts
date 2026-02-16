"use client";

import { useAuthContext } from "@/AuthContext";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";

export const USER_ROLE = {
  SYS_ADMIN: "sys_admin",
  TENANT_ADMIN: "tenant_admin",
  TENANT_STAFF: "tenant_staff",
  CLIENT: "client",
  UNKNOWN: "unknown",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export function useUser() {
  const { user: authUser, isAuthenticated } = useAuthContext();
  const {
    userRoles,
    isLoading: rbacLoading,
    userPermissions,
    hasRole,
    canViewDashboard,
  } = useRBAC();

  // Get user profile
  const { data: userProfile, isLoading: profileLoading } =
    trpc.user.getProfile.useQuery(undefined, {
      enabled: !!authUser?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      refetchOnWindowFocus: false,
    });

  const [primaryRole, setPrimaryRole] = useState<UserRole>(USER_ROLE.UNKNOWN);

  // Calculate primary role based on user roles
  useEffect(() => {
    if (!isAuthenticated || rbacLoading || !userRoles?.length) {
      setPrimaryRole(USER_ROLE.UNKNOWN);
      return;
    }

    // Priority order: sys_admin > tenant_admin > tenant_staff > client
    const roleHierarchy: Record<string, UserRole> = {
      [USER_ROLE.SYS_ADMIN]: USER_ROLE.SYS_ADMIN,
      [USER_ROLE.TENANT_ADMIN]: USER_ROLE.TENANT_ADMIN,
      [USER_ROLE.TENANT_STAFF]: USER_ROLE.TENANT_STAFF,
      [USER_ROLE.CLIENT]: USER_ROLE.CLIENT,
      // Backward compatibility mappings
      super_admin: USER_ROLE.SYS_ADMIN,
      admin: USER_ROLE.TENANT_ADMIN,
      owner: USER_ROLE.TENANT_ADMIN,
      user: USER_ROLE.CLIENT,
      viewer: USER_ROLE.CLIENT,
    };

    // Find the highest priority role
    let highestRole: UserRole = USER_ROLE.CLIENT;
    const priorityOrder: UserRole[] = [
      USER_ROLE.SYS_ADMIN,
      USER_ROLE.TENANT_ADMIN,
      USER_ROLE.TENANT_STAFF,
      USER_ROLE.CLIENT,
    ];

    for (const userRole of userRoles) {
      if (userRole.isActive && roleHierarchy[userRole.name]) {
        const mappedRole = roleHierarchy[userRole.name];
        if (!mappedRole) continue;
        const currentIdx = priorityOrder.indexOf(highestRole);
        const newIdx = priorityOrder.indexOf(mappedRole);
        if (newIdx < currentIdx) {
          highestRole = mappedRole;
        }
        if (highestRole === USER_ROLE.SYS_ADMIN) break;
      }
    }

    setPrimaryRole(highestRole);
  }, [isAuthenticated, userRoles, rbacLoading]);

  const isLoading = rbacLoading || profileLoading;

  return {
    // User data
    user: userProfile || authUser,
    userProfile,
    authUser,

    // Role information
    primaryRole,
    userRoles,
    userPermissions,

    // New role flags
    isSysAdmin: primaryRole === USER_ROLE.SYS_ADMIN,
    isTenantAdmin: primaryRole === USER_ROLE.TENANT_ADMIN,
    isTenantStaff: primaryRole === USER_ROLE.TENANT_STAFF,
    isClient: primaryRole === USER_ROLE.CLIENT,

    // Backward compatibility aliases
    isAdmin:
      primaryRole === USER_ROLE.SYS_ADMIN ||
      primaryRole === USER_ROLE.TENANT_ADMIN,
    isSuperAdmin: primaryRole === USER_ROLE.SYS_ADMIN,
    isOwner: primaryRole === USER_ROLE.TENANT_ADMIN,
    isUser: primaryRole === USER_ROLE.CLIENT,
    isViewer: primaryRole === USER_ROLE.CLIENT,

    // RBAC utilities
    hasRole,
    canViewDashboard,

    // Loading states
    isLoading,
    isAuthenticated,
  };
}
