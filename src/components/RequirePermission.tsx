"use client";

import { useRBAC } from "@/hooks/useRBAC";
import type { PermissionAction, PermissionResource } from "@/types/rbac";

export function RequirePermission({
  action,
  resource,
  children,
  fallback = null,
}: {
  action: PermissionAction;
  resource: PermissionResource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = useRBAC();
  if (!hasPermission(action, resource)) return fallback;
  return <>{children}</>;
}
