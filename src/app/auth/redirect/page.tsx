"use client";

import { useAuthContext } from "@/AuthContext";
import { useUser } from "@/hooks/useUser";
import { getDefaultRoute } from "@/lib/routes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Post-login redirect page.
 * Reads the user's role and sends them to the correct panel.
 */
export default function AuthRedirectPage() {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { primaryRole, isLoading: roleLoading } = useUser();
  const router = useRouter();

  const isLoading = authLoading || roleLoading;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/signin");
      return;
    }

    if (primaryRole !== "unknown") {
      router.replace(getDefaultRoute(primaryRole));
    }
  }, [isLoading, isAuthenticated, primaryRole, router]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center min-h-screen bg-background">
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
