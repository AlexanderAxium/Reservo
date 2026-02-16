"use client";

import { useRBAC } from "@/hooks/useRBAC";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const { hasPermission } = useRBAC();

  useEffect(() => {
    if (hasPermission(PermissionAction.READ, PermissionResource.SETTINGS)) {
      router.replace("/dashboard/settings/general");
    }
  }, [router, hasPermission]);

  if (!hasPermission(PermissionAction.READ, PermissionResource.SETTINGS)) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta sección
          </p>
        </div>
      </div>
    );
  }

  return null;
}
