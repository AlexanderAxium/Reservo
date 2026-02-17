"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { TenantPicker } from "@/components/dashboard/TenantPicker";
import { TenantSidebar } from "@/components/layouts/TenantSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useImpersonation } from "@/hooks/useImpersonation";
import { useRouteGuard } from "@/hooks/useRouteGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized, isAuthenticated, primaryRole } =
    useRouteGuard({
      allowedRoles: ["tenant_admin", "tenant_staff", "sys_admin"],
    });

  const { isImpersonating } = useImpersonation();

  if (isLoading || !isAuthenticated || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // sys_admin accessing /dashboard without selecting a tenant first
  if (primaryRole === "sys_admin" && !isImpersonating) {
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
