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
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
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
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; href: string }[];
}

function getNavItems(isTenantAdmin: boolean): NavItem[] {
  const items: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  if (isTenantAdmin) {
    items.push({
      title: "Sport Centers",
      href: "/dashboard/sport-centers",
      icon: Store,
    });
  }

  items.push(
    { title: "Fields", href: "/dashboard/fields", icon: MapPin },
    {
      title: "Reservations",
      href: "/dashboard/reservations",
      icon: Calendar,
      children: [
        { title: "List", href: "/dashboard/reservations" },
        { title: "Calendar", href: "/dashboard/reservations/calendar" },
      ],
    },
    { title: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { title: "Clients", href: "/dashboard/clients", icon: UsersRound }
  );

  if (isTenantAdmin) {
    items.push(
      { title: "Staff", href: "/dashboard/staff", icon: Users },
      {
        title: "Metrics",
        href: "/dashboard/metrics",
        icon: BarChart3,
        children: [
          { title: "Overview", href: "/dashboard/metrics" },
          { title: "Revenue", href: "/dashboard/metrics/revenue" },
          { title: "Occupancy", href: "/dashboard/metrics/occupancy" },
        ],
      },
      { title: "Features", href: "/dashboard/features", icon: Star },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        children: [
          { title: "General", href: "/dashboard/settings" },
          {
            title: "Payment Methods",
            href: "/dashboard/settings/payment-methods",
          },
          { title: "Notifications", href: "/dashboard/settings/notifications" },
        ],
      }
    );
  }

  return items;
}

export function TenantSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthContext();
  const { isTenantAdmin } = useRBAC();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  const navItems = getNavItems(isTenantAdmin);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleSubmenu = (href: string) => {
    setExpandedMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar overflow-hidden">
      <SidebarHeader
        className={cn("border-b border-border/30", isCollapsed ? "p-2" : "p-3")}
      >
        <div
          className={cn(
            "rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/15 dark:via-primary/5 border",
            isCollapsed ? "p-2 flex justify-center items-center" : "p-3"
          )}
        >
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-3"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
              R
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  Reservo
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {isTenantAdmin ? "Admin Panel" : "Staff Panel"}
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden",
          isCollapsed ? "px-2 py-2" : "px-3 py-4"
        )}
      >
        <SidebarGroup className="w-full">
          <SidebarGroupLabel
            className={cn(
              "text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2",
              isCollapsed ? "hidden" : "px-2"
            )}
          >
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="w-full">
            <SidebarMenu
              className={cn(
                "w-full flex flex-col",
                isCollapsed ? "space-y-1" : "space-y-0.5"
              )}
            >
              {navItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    !hasChildren &&
                    pathname.startsWith(`${item.href}/`));
                const isChildActive =
                  hasChildren &&
                  item.children?.some((child) => pathname === child.href);
                const isExpanded = expandedMenus[item.href] || isChildActive;

                if (hasChildren && !isCollapsed) {
                  return (
                    <SidebarMenuItem key={item.href} className="w-full">
                      <SidebarMenuButton
                        isActive={isActive || !!isChildActive}
                        tooltip={item.title}
                        onClick={() => toggleSubmenu(item.href)}
                        className={cn(
                          "group/item relative transition-all duration-200 h-9 w-full px-3 rounded-lg",
                          isActive || isChildActive
                            ? "bg-primary/10 text-primary shadow-sm shadow-primary/10 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-r-full before:bg-primary before:transition-all"
                            : "text-sidebar-foreground/70 hover:bg-accent/30 hover:text-foreground"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "shrink-0 transition-all duration-200 size-5",
                            isActive || isChildActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover/item:text-primary"
                          )}
                        />
                        <span className="font-medium truncate flex-1">
                          {item.title}
                        </span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
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
                  <SidebarMenuItem
                    key={item.href}
                    className="w-full flex justify-center"
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "group/item relative transition-all duration-200",
                        isCollapsed
                          ? "h-9 w-full justify-center items-center px-2 rounded-lg"
                          : "h-9 w-full px-3 rounded-lg",
                        isActive
                          ? cn(
                              isCollapsed
                                ? "bg-primary/15 text-primary"
                                : "bg-primary/10 text-primary shadow-sm shadow-primary/10 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-r-full before:bg-primary before:transition-all"
                            )
                          : "text-sidebar-foreground/70 hover:bg-accent/30 hover:text-foreground"
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
                          className={cn(
                            "shrink-0 transition-all duration-200",
                            isCollapsed ? "size-4" : "size-5",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover/item:text-primary"
                          )}
                        />
                        {!isCollapsed && (
                          <span className="font-medium truncate">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className={cn("border-t border-border/30", isCollapsed ? "p-2" : "p-3")}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center w-full hover:opacity-80 transition-opacity rounded-md",
                isCollapsed ? "justify-center p-2" : "gap-3 p-2"
              )}
            >
              <Avatar
                className={cn("shrink-0", isCollapsed ? "h-8 w-8" : "h-9 w-9")}
              >
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold border-2 border-primary-foreground">
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
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            {isTenantAdmin && (
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
