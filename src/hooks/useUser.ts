"use client";

import { useAuthContext } from "@/AuthContext";
import { STALE_TIME } from "@/constants/time";
import { useRBAC } from "@/hooks/useRBAC";
import { DEFAULT_ROLES } from "@/types/rbac";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";

export const USER_ROLE = {
  ...DEFAULT_ROLES,
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
      staleTime: STALE_TIME,
      refetchOnWindowFocus: false,
    });

  // Compute primary role synchronously to avoid one-tick race conditions
  const primaryRole = useMemo<UserRole>(() => {
    if (!isAuthenticated || rbacLoading || !userRoles?.length) {
      return USER_ROLE.UNKNOWN;
    }

    const priorityOrder: UserRole[] = [
      USER_ROLE.SYS_ADMIN,
      USER_ROLE.TENANT_ADMIN,
      USER_ROLE.TENANT_STAFF,
      USER_ROLE.CLIENT,
    ];

    let highestRole: UserRole = USER_ROLE.CLIENT;

    for (const userRole of userRoles) {
      if (!userRole.isActive) continue;
      const idx = priorityOrder.indexOf(userRole.name as UserRole);
      if (idx === -1) continue;
      const currentIdx = priorityOrder.indexOf(highestRole);
      if (idx < currentIdx) {
        highestRole = priorityOrder[idx] as UserRole;
      }
      if (highestRole === USER_ROLE.SYS_ADMIN) break;
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

    // Role flags
    isSysAdmin: primaryRole === USER_ROLE.SYS_ADMIN,
    isTenantAdmin: primaryRole === USER_ROLE.TENANT_ADMIN,
    isTenantStaff: primaryRole === USER_ROLE.TENANT_STAFF,
    isClient: primaryRole === USER_ROLE.CLIENT,
    isAdmin:
      primaryRole === USER_ROLE.SYS_ADMIN ||
      primaryRole === USER_ROLE.TENANT_ADMIN,

    // RBAC utilities
    hasRole,
    canViewDashboard,

    // Loading states
    isLoading,
    isAuthenticated,
  };
}
