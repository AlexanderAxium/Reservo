"use client";

import { useAuthContext } from "@/AuthContext";
import { TenantSidebar } from "@/components/layouts/TenantSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRBAC } from "@/hooks/useRBAC";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuthContext();
  const { isTenantMember, isLoading: rbacLoading } = useRBAC();
  const router = useRouter();

  useEffect(() => {
    if (loading || rbacLoading) return;
    if (!isAuthenticated) {
      router.replace("/signin");
      return;
    }
    if (!isTenantMember) {
      router.replace("/");
    }
  }, [isAuthenticated, isTenantMember, loading, rbacLoading, router]);

  if (loading || rbacLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isTenantMember) {
    return null;
  }

  return (
    <SidebarProvider>
      <TenantSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur-md px-3 sm:px-4">
          <SidebarTrigger className="-ml-1 h-8 w-8" />
          <div className="flex-1" />
        </header>
        <div className="flex flex-1 flex-col">
          <div className="min-h-[100vh] flex-1 bg-background p-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
