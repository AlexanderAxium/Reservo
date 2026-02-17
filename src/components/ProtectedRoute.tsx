"use client";

import { useAuthContext } from "@/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  fallback,
}: ProtectedRouteProps) {
  const { loading, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return fallback || <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
