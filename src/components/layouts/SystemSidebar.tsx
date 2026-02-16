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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/system", icon: LayoutDashboard },
  { title: "Organizations", href: "/system/organizations", icon: Building2 },
  { title: "Users", href: "/system/users", icon: Users },
  { title: "Roles & Permissions", href: "/system/roles", icon: Shield },
  { title: "Settings", href: "/system/settings", icon: Settings },
];

export function SystemSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthContext();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar overflow-hidden">
      <SidebarHeader
        className={cn("border-b border-border/30", isCollapsed ? "p-2" : "p-3")}
      >
        <div
          className={cn(
            "rounded-lg bg-gradient-to-br from-slate-800/10 via-slate-700/5 to-transparent dark:from-slate-300/10 dark:via-slate-400/5 border",
            isCollapsed ? "p-2 flex justify-center items-center" : "p-3"
          )}
        >
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-3"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background text-sm font-bold">
              S
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  System Admin
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Control Panel
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
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/system" &&
                    pathname.startsWith(`${item.href}/`));

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
                                ? "bg-foreground/15 text-foreground"
                                : "bg-foreground/10 text-foreground shadow-sm before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-r-full before:bg-foreground before:transition-all"
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
                              ? "text-foreground"
                              : "text-muted-foreground group-hover/item:text-foreground"
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
                <AvatarFallback className="bg-foreground text-background text-sm font-semibold">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "SA"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name || "System Admin"}
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
                  {user?.name || "System Admin"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/system/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
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
