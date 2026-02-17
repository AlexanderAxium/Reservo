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
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import {
  Building2,
  ChevronsUpDown,
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
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export function SystemSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthContext();
  const { t } = useTranslation("dashboard");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    await signOut();
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  const sections: NavSection[] = [
    {
      label: t("sidebar.overview"),
      items: [
        { title: t("nav.dashboard"), href: "/system", icon: LayoutDashboard },
      ],
    },
    {
      label: t("sidebar.management"),
      items: [
        {
          title: t("nav.organizations"),
          href: "/system/organizations",
          icon: Building2,
        },
      ],
    },
    {
      label: t("sidebar.accessControl"),
      items: [
        { title: t("users"), href: "/system/users", icon: Users },
        {
          title: t("nav.rolesPermissions"),
          href: "/system/roles",
          icon: Shield,
        },
      ],
    },
    {
      label: t("sidebar.system"),
      items: [
        { title: t("nav.settings"), href: "/system/settings", icon: Settings },
      ],
    },
  ];

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
            S
          </div>
          {!isCollapsed && (
            <span className="text-base font-semibold text-foreground">
              {t("systemLabel")}
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
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/system" &&
                      pathname.startsWith(`${item.href}/`));

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
                          {!isCollapsed && (
                            <span className="truncate">{item.title}</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
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
                      {user?.name || t("superAdmin")}
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
                  {user?.name || t("superAdmin")}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/system/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("nav.settings")}</span>
            </DropdownMenuItem>
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
