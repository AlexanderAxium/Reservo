"use client";

import { useAuthContext } from "@/AuthContext";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

export function RoleBasedRedirect({ children }: RoleBasedRedirectProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { primaryRole, isLoading: roleLoading } = useUser();

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!isAuthenticated) return;

    // Redirect based on primary role
    switch (primaryRole) {
      case "sys_admin":
        if (!pathname.startsWith("/system")) {
          router.replace("/system");
        }
        break;
      case "tenant_admin":
      case "tenant_staff":
        if (!pathname.startsWith("/dashboard")) {
          router.replace("/dashboard");
        }
        break;
      case "client":
        if (!pathname.startsWith("/my")) {
          router.replace("/my");
        }
        break;
      default:
        break;
    }
  }, [
    primaryRole,
    pathname,
    isAuthenticated,
    authLoading,
    roleLoading,
    router,
  ]);

  // Show loading state while determining role
  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="Loading"
              fill
              className="object-contain animate-spin"
              style={{ animationDuration: "2s" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
