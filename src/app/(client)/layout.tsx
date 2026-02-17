"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { ClientSidebar } from "@/components/layouts/ClientSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouteGuard } from "@/hooks/useRouteGuard";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthorized, isAuthenticated } = useRouteGuard({
    allowedRoles: ["client", "sys_admin"],
  });

  if (isLoading || !isAuthenticated || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/70 backdrop-blur-md px-3 sm:px-4">
          <SidebarTrigger className="-ml-1 h-8 w-8" />
          <DashboardNavbar basePath="/my" />
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
