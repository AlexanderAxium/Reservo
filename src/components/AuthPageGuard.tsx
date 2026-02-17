"use client";

import { useAuthContext } from "@/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUser } from "@/hooks/useUser";
import { getDefaultRoute } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Wraps auth pages (signin, signup, etc.).
 * Redirects already-authenticated users to their default panel.
 */
export function AuthPageGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { primaryRole, isLoading: roleLoading } = useUser();
  const router = useRouter();

  const isLoading = authLoading || roleLoading;

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && primaryRole !== "unknown") {
      router.replace(getDefaultRoute(primaryRole));
    }
  }, [isLoading, isAuthenticated, primaryRole, router]);

  if (isLoading || (isAuthenticated && primaryRole !== "unknown")) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
}
