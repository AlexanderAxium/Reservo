"use client";

import { useAuthContext } from "@/AuthContext";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";

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

  // Compute primary role synchronously to avoid one-tick race conditions
  const primaryRole = useMemo<UserRole>(() => {
    if (!isAuthenticated || rbacLoading || !userRoles?.length) {
      return USER_ROLE.UNKNOWN;
    }

    const roleHierarchy: Record<string, UserRole> = {
      [USER_ROLE.SYS_ADMIN]: USER_ROLE.SYS_ADMIN,
      [USER_ROLE.TENANT_ADMIN]: USER_ROLE.TENANT_ADMIN,
      [USER_ROLE.TENANT_STAFF]: USER_ROLE.TENANT_STAFF,
      [USER_ROLE.CLIENT]: USER_ROLE.CLIENT,
      super_admin: USER_ROLE.SYS_ADMIN,
      admin: USER_ROLE.TENANT_ADMIN,
      owner: USER_ROLE.TENANT_ADMIN,
      user: USER_ROLE.CLIENT,
      viewer: USER_ROLE.CLIENT,
    };

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

    return highestRole;
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
