"use client";

import { useAuthContext } from "@/AuthContext";
import { type UserRole, useUser } from "@/hooks/useUser";
import { getDefaultRoute } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseRouteGuardOptions {
  allowedRoles: UserRole[];
}

/**
 * Shared route guard hook for protected layouts.
 * - Not authenticated → redirect to /signin
 * - Role not in allowedRoles → redirect to user's default route
 * - Returns loading/authorized state for the layout to decide what to render.
 */
export function useRouteGuard({ allowedRoles }: UseRouteGuardOptions) {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { primaryRole, isLoading: roleLoading } = useUser();
  const router = useRouter();

  // Treat "unknown" role while authenticated as still resolving
  const roleResolved = !isAuthenticated || primaryRole !== "unknown";
  const isLoading = authLoading || roleLoading || !roleResolved;
  const isAuthorized = allowedRoles.includes(primaryRole);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/signin");
      return;
    }

    if (!isAuthorized) {
      router.replace(getDefaultRoute(primaryRole));
    }
  }, [isLoading, isAuthenticated, isAuthorized, primaryRole, router]);

  return { isLoading, isAuthorized, isAuthenticated, primaryRole };
}
