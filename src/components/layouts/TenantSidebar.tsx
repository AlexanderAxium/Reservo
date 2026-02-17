"use client";

import { useAuthContext } from "@/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRBAC } from "@/hooks/useRBAC";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import {
  Calendar,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  Star,
  Store,
  User,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children?: { title: string; href: string }[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

type HasPermissionFn = (
  action: PermissionAction,
  resource: PermissionResource
) => boolean;

type TranslateFn = (key: string, params?: Record<string, string>) => string;

function getNavSections(can: HasPermissionFn, t: TranslateFn): NavSection[] {
  const generalItems: NavItem[] = [
    { title: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
  ];

  if (can(PermissionAction.READ, PermissionResource.SPORT_CENTER)) {
    generalItems.push({
      title: t("nav.sportCenters"),
      href: "/dashboard/sport-centers",
      icon: Store,
    });
  }

  generalItems.push({
    title: t("nav.fields"),
    href: "/dashboard/fields",
    icon: MapPin,
  });

  const managementItems: NavItem[] = [
    {
      title: t("nav.reservations"),
      href: "/dashboard/reservations",
      icon: Calendar,
      children: [
        { title: t("nav.list"), href: "/dashboard/reservations" },
        { title: t("nav.calendar"), href: "/dashboard/reservations/calendar" },
      ],
    },
    {
      title: t("nav.payments"),
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: t("nav.clients"),
      href: "/dashboard/clients",
      icon: UsersRound,
    },
  ];

  const adminItems: NavItem[] = [];

  if (can(PermissionAction.READ, PermissionResource.STAFF)) {
    adminItems.push({
      title: t("nav.team"),
      href: "/dashboard/staff",
      icon: Users,
    });
  }

  if (can(PermissionAction.READ, PermissionResource.FIELD)) {
    adminItems.push({
      title: t("nav.features"),
      href: "/dashboard/features",
      icon: Star,
    });
  }

  if (can(PermissionAction.READ, PermissionResource.SETTINGS)) {
    adminItems.push({
      title: t("nav.settings"),
      href: "/dashboard/settings",
      icon: Settings,
      children: [
        { title: t("nav.general"), href: "/dashboard/settings" },
        {
          title: t("nav.paymentMethods"),
          href: "/dashboard/settings/payment-methods",
        },
        {
          title: t("nav.notifications"),
          href: "/dashboard/settings/notifications",
        },
      ],
    });
  }

  const sections: NavSection[] = [
    { label: t("sidebar.general"), items: generalItems },
    { label: t("sidebar.management"), items: managementItems },
  ];

  if (adminItems.length > 0) {
    sections.push({ label: t("sidebar.admin"), items: adminItems });
  }

  return sections;
}

export function TenantSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthContext();
  const { hasPermission } = useRBAC();
  const { t } = useTranslation("dashboard");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  const sections = getNavSections(hasPermission, t);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleSubmenu = (href: string) => {
    setExpandedMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive =
      pathname === item.href ||
      (item.href !== "/dashboard" &&
        !hasChildren &&
        pathname.startsWith(`${item.href}/`));
    const isChildActive =
      hasChildren && item.children?.some((child) => pathname === child.href);
    const isExpanded = expandedMenus[item.href] || isChildActive;

    if (hasChildren && !isCollapsed) {
      return (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            isActive={isActive || !!isChildActive}
            tooltip={item.title}
            onClick={() => toggleSubmenu(item.href)}
            className={cn(
              "group/item h-10 w-full px-3 rounded-lg transition-colors",
              isActive || isChildActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon
              size={20}
              className={cn(
                "shrink-0",
                isActive || isChildActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover/item:text-foreground"
              )}
            />
            <span className="truncate flex-1">{item.title}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-200",
                isExpanded && "rotate-90"
              )}
            />
          </SidebarMenuButton>
          {isExpanded && (
            <SidebarMenuSub>
              {item.children?.map((child) => (
                <SidebarMenuSubItem key={child.href}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === child.href}
                  >
                    <Link href={child.href}>
                      <span>{child.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={item.title}
          className={cn(
            "group/item h-10 w-full rounded-lg transition-colors",
            isCollapsed ? "justify-center px-2" : "px-3",
            isActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Link
            href={item.href}
            className={cn(
              "flex items-center w-full min-w-0",
              isCollapsed ? "justify-center" : "gap-3"
            )}
          >
            <item.icon
              size={20}
              className={cn(
                "shrink-0",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover/item:text-foreground"
              )}
            />
            {!isCollapsed && <span className="truncate">{item.title}</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar overflow-hidden">
      <SidebarHeader className={cn("px-4 py-4", isCollapsed && "px-2 py-3")}>
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-2.5"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            R
          </div>
          {!isCollapsed && (
            <span className="text-base font-semibold text-foreground">
              Reservo
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden",
          isCollapsed ? "px-2 py-2" : "px-3 py-2"
        )}
      >
        {sections.map((section, idx) => (
          <SidebarGroup
            key={section.label}
            className={cn("py-3", idx > 0 && "border-t border-border/40")}
          >
            {!isCollapsed && (
              <SidebarGroupLabel className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {section.items.map(renderNavItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter
        className={cn(
          "border-t border-border/40",
          isCollapsed ? "p-2" : "px-3 py-3"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center w-full rounded-lg transition-colors hover:bg-muted",
                isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5"
              )}
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex flex-col items-start text-left min-w-0 flex-1">
                    <span className="text-sm font-medium text-foreground truncate w-full">
                      {user?.name || t("nav.user")}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || t("nav.user")}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>{t("nav.profile")}</span>
            </DropdownMenuItem>
            {hasPermission(
              PermissionAction.READ,
              PermissionResource.SETTINGS
            ) && (
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("nav.settings")}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("nav.signOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
