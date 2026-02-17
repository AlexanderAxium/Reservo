"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { TenantPicker } from "@/components/dashboard/TenantPicker";
import { TenantSidebar } from "@/components/layouts/TenantSidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useImpersonation } from "@/hooks/useImpersonation";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { DEFAULT_ROLES } from "@/types/rbac";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized, isAuthenticated, primaryRole } =
    useRouteGuard({
      allowedRoles: [
        DEFAULT_ROLES.TENANT_ADMIN,
        DEFAULT_ROLES.TENANT_STAFF,
        DEFAULT_ROLES.SYS_ADMIN,
      ],
    });

  const { isImpersonating } = useImpersonation();

  if (isLoading || !isAuthenticated || !isAuthorized) {
    return <LoadingSpinner fullScreen />;
  }

  // sys_admin accessing /dashboard without selecting a tenant first
  if (primaryRole === DEFAULT_ROLES.SYS_ADMIN && !isImpersonating) {
    return <TenantPicker />;
  }

  return (
    <SidebarProvider>
      <TenantSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/70 backdrop-blur-md px-3 sm:px-4">
          <SidebarTrigger className="-ml-1 h-8 w-8" />
          <DashboardNavbar basePath="/dashboard" />
        </header>
        <div className="flex flex-1 flex-col">
          <div className="min-h-[100vh] flex-1 bg-background p-6 sm:p-8">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
