"use client";

import { useAuthContext } from "@/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useImpersonation } from "@/hooks/useImpersonation";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { ArrowLeft, Eye, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface DashboardNavbarProps {
  basePath?: string;
}

export function DashboardNavbar({
  basePath = "/dashboard",
}: DashboardNavbarProps) {
  const { user, signOut } = useAuthContext();
  const { primaryRole, isAdmin, isSuperAdmin } = useUser();
  const { impersonatedTenant, stopImpersonation, isImpersonating } =
    useImpersonation();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const { t: tDashboard } = useTranslation("dashboard");

  const handleSignOut = async () => {
    await signOut();
  };

  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const baseLabel =
      basePath === "/system"
        ? tDashboard("system.title")
        : basePath === "/my"
          ? tDashboard("nav.myAccount")
          : t("dashboard");
    const breadcrumbs: Array<{ label: string; href: string }> = [
      { label: baseLabel, href: basePath },
    ];

    const routeMap: Record<string, string> = {
      users: tDashboard("users"),
      roles: tDashboard("rolesPermissions"),
      settings: tDashboard("settings2"),
      profile: t("profile"),
      organizations: tDashboard("nav.organizations"),
      reservations: tDashboard("nav.reservations"),
      fields: tDashboard("nav.fields"),
      payments: tDashboard("nav.payments"),
      clients: tDashboard("nav.clients"),
      staff: tDashboard("staffPage.title"),
      features: tDashboard("featuresPage.title"),
      "sport-centers": tDashboard("nav.sportCenters"),
    };

    const baseSegment = basePath.replace(/^\//, "");

    segments.forEach((segment, index) => {
      if (segment === baseSegment) return;

      const href = `/${segments.slice(0, index + 1).join("/")}`;
      let label = routeMap[segment] || segment;

      if (index === segments.length - 1 && /^[0-9a-f-]+$/i.test(segment)) {
        label = tDashboard("viewDetails");
      }

      breadcrumbs.push({ label, href });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const profilePath =
    basePath === "/system"
      ? "/system/settings"
      : basePath === "/my"
        ? "/my/profile"
        : "/dashboard/profile";

  const settingsPath =
    basePath === "/system"
      ? "/system/settings"
      : basePath === "/my"
        ? "/my/settings"
        : "/dashboard/settings";

  return (
    <div className="flex flex-1 items-center justify-between min-w-0 gap-4">
      {/* Impersonation indicator (unified in header) */}
      {isImpersonating && impersonatedTenant && basePath === "/dashboard" && (
        <div className="flex items-center gap-2 shrink-0 rounded-lg border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 px-3 py-1.5">
          <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
            {tDashboard("system.viewingTenant")}: {impersonatedTenant.name}
          </span>
          <button
            type="button"
            onClick={stopImpersonation}
            className="flex items-center gap-1 rounded-md bg-amber-600/20 dark:bg-amber-400/20 px-2 py-1 text-xs font-medium text-amber-800 dark:text-amber-200 transition-colors hover:bg-amber-600/30 dark:hover:bg-amber-400/30"
          >
            <ArrowLeft className="h-3 w-3" />
            {tDashboard("system.returnToSystem")}
          </button>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="min-w-0 flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.href}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-foreground font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <NotificationBell />
        <LanguageSelector />
        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "relative h-8 w-8 rounded-full p-0 hover:bg-accent/50 transition-colors",
                "focus-visible:ring-2 focus-visible:ring-primary/20"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs border-2 border-primary/20">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "Usuario"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
                {primaryRole && (
                  <p className="text-xs leading-none text-muted-foreground capitalize mt-1">
                    {primaryRole === "unknown"
                      ? tDashboard("noRoleAssigned")
                      : primaryRole.replace("_", " ")}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(profilePath)}>
              <User className="mr-2 h-4 w-4" />
              <span>{t("profile")}</span>
            </DropdownMenuItem>
            {(isSuperAdmin || isAdmin) && (
              <DropdownMenuItem onClick={() => router.push(settingsPath)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("settings")}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("signOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
