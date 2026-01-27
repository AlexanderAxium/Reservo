"use client";

import { useAuthContext } from "@/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import { useUser } from "@/hooks/useUser";
import type { AuthUser } from "@/types/user";

export default function OwnerDashboardPage() {
  const { user } = useAuthContext();

  // Adapter function to convert user data to expected dashboard user format
  const adaptUserForDashboard = (userData: unknown) => {
    if (!userData || typeof userData !== "object") return null;

    const user = userData as Record<string, unknown>;
    return {
      id: user.id as string,
      name: user.name as string,
      email: user.email as string,
      emailVerified: user.emailVerified as boolean,
      tenantId: user.tenantId as string | undefined,
    };
  };

  return (
    <ProtectedRoute>
      <OwnerDashboard user={adaptUserForDashboard(user)} />
    </ProtectedRoute>
  );
}
