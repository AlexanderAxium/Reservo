"use client";

import { useAuthContext } from "@/AuthContext";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";

export type UserRole =
  | "sys_admin"
  | "tenant_admin"
  | "tenant_staff"
  | "client"
  | "unknown";

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

  const [primaryRole, setPrimaryRole] = useState<UserRole>("unknown");

  // Calculate primary role based on user roles
  useEffect(() => {
    if (!isAuthenticated || rbacLoading || !userRoles?.length) {
      setPrimaryRole("unknown");
      return;
    }

    // Priority order: sys_admin > tenant_admin > tenant_staff > client
    const roleHierarchy: Record<string, UserRole> = {
      sys_admin: "sys_admin",
      tenant_admin: "tenant_admin",
      tenant_staff: "tenant_staff",
      client: "client",
      // Backward compatibility mappings
      super_admin: "sys_admin",
      admin: "tenant_admin",
      owner: "tenant_admin",
      user: "client",
      viewer: "client",
    };

    // Find the highest priority role
    let highestRole: UserRole = "client";
    const priorityOrder: UserRole[] = [
      "sys_admin",
      "tenant_admin",
      "tenant_staff",
      "client",
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
        if (highestRole === "sys_admin") break;
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
    isSysAdmin: primaryRole === "sys_admin",
    isTenantAdmin: primaryRole === "tenant_admin",
    isTenantStaff: primaryRole === "tenant_staff",
    isClient: primaryRole === "client",

    // Backward compatibility aliases
    isAdmin: ["sys_admin", "tenant_admin"].includes(primaryRole),
    isSuperAdmin: primaryRole === "sys_admin",
    isOwner: primaryRole === "tenant_admin",
    isUser: primaryRole === "client",
    isViewer: primaryRole === "client",

    // RBAC utilities
    hasRole,
    canViewDashboard,

    // Loading states
    isLoading,
    isAuthenticated,
  };
}
