"use client";

import { useAuthContext } from "@/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "@/components/ui/language-selector";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useUser";
import { getInitials } from "@/lib/utils/avatar";
import { LayoutDashboard, LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Navbar simplificado: solo Inicio y Canchas (landing Cancha Libre)

export default function GlobalNavbar() {
  const _pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthContext();
  const { primaryRole, isAdmin, isSuperAdmin } = useUser();
  const router = useRouter();
  const { t } = useTranslation("common");

  const handleSignOut = useCallback(async () => {
    await signOut();
    setIsMenuOpen(false);
  }, [signOut]);

  const handleSignIn = useCallback(() => {
    router.push("/signin");
    setIsMenuOpen(false);
  }, [router]);

  const getDashboardUrl = useCallback(() => {
    switch (primaryRole) {
      case "admin":
      case "super_admin":
      case "user":
      case "viewer":
        return "/dashboard";
      default:
        return "/dashboard";
    }
  }, [primaryRole]);

  const userInitials = useMemo(() => getInitials(user?.name), [user?.name]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      setIsScrolled(scrollPosition > viewportHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800 shadow-sm"
            : "bg-white/80 dark:bg-transparent border-b border-gray-200/50 dark:border-transparent backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-12 md:h-14">
            {/* Logo Cancha Libre */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
                  CL
                </span>
                <span className="font-semibold text-lg text-foreground dark:text-white">
                  Cancha Libre
                </span>
              </Link>
            </div>

            {/* Desktop: solo Inicio y Canchas */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? "text-foreground hover:text-emerald-600"
                    : "text-foreground dark:text-white hover:text-emerald-400"
                }`}
              >
                {t("home")}
              </Link>
              <Link
                href="/canchas"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? "text-foreground hover:text-emerald-600"
                    : "text-foreground dark:text-white hover:text-emerald-400"
                }`}
              >
                {t("fields")}
              </Link>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:block">
              <div className="ml-4 flex items-center md:ml-6 gap-3">
                <ThemeToggle />
                <LanguageSelector isTransparent={!isScrolled} />
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    {/* User Name */}
                    <span
                      className={`font-medium text-sm transition-colors ${
                        isScrolled
                          ? "text-foreground"
                          : "text-foreground dark:text-white"
                      }`}
                    >
                      {user?.name || t("user")}
                    </span>

                    {/* User Avatar Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          <Avatar className="h-7 w-7 md:h-8 md:w-8">
                            {user?.image ? (
                              <AvatarImage
                                src={user.image}
                                alt={user?.name || "Usuario"}
                              />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {userInitials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user?.name || t("user")}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user?.email || ""}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push(getDashboardUrl())}
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>{t("dashboard")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/dashboard/settings")}
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>{t("profile")}</span>
                        </DropdownMenuItem>
                        {(isSuperAdmin || isAdmin) && (
                          <DropdownMenuItem
                            onClick={() => router.push("/dashboard/settings")}
                          >
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
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/signup"
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isScrolled
                          ? "text-foreground hover:text-emerald-600 hover:bg-muted/80"
                          : "text-foreground dark:text-white hover:text-emerald-400 hover:bg-white/10"
                      }`}
                    >
                      {t("signUp")}
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignIn}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm ${
                        isScrolled
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-primary text-primary-foreground dark:bg-white dark:text-gray-900 hover:opacity-90 border border-border dark:border-white/20"
                      }`}
                    >
                      {t("signIn")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-inset ${
                      isScrolled
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-400"
                        : "text-white/90 hover:text-white hover:bg-white/10 focus:ring-white/50"
                    }`}
                  >
                    <span className="sr-only">{t("openMenu")}</span>
                    <Menu
                      className="block h-5 w-5 md:h-6 md:w-6"
                      aria-hidden="true"
                    />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-96 bg-white dark:bg-gray-900 border-gray-200"
                >
                  <SheetHeader className="px-2">
                    <SheetTitle className="text-foreground text-lg">
                      {t("mainMenu")}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 px-2">
                    <div className="mb-4 flex flex-col gap-2">
                      <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        {t("home")}
                      </Link>
                      <Link
                        href="/canchas"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        {t("fields")}
                      </Link>
                    </div>
                    <div className="mb-4 flex items-center gap-2 px-2">
                      <ThemeToggle />
                      <LanguageSelector />
                    </div>
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 px-3 py-2">
                          <Avatar>
                            {user?.image ? (
                              <AvatarImage
                                src={user.image}
                                alt={user?.name || t("user")}
                              />
                            ) : (
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {userInitials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">
                              {user?.name || t("user")}
                            </span>
                            <span className="text-xs text-gray-300">
                              {user?.email || ""}
                            </span>
                          </div>
                        </div>

                        {/* Dashboard Link */}
                        <button
                          type="button"
                          onClick={() => {
                            router.push(getDashboardUrl());
                            setIsMenuOpen(false);
                          }}
                          className="group flex items-center px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-accent w-full"
                        >
                          <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-white">
                              {t("dashboard")}
                            </div>
                            <div className="text-xs text-gray-400">
                              {t("mainPanel")}
                            </div>
                          </div>
                        </button>

                        {(isSuperAdmin || isAdmin) && (
                          <button
                            type="button"
                            onClick={() => {
                              router.push("/dashboard/settings");
                              setIsMenuOpen(false);
                            }}
                            className="group flex items-center px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-accent w-full"
                          >
                            <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                            <div className="flex-1 text-left">
                              <div className="font-medium text-white">
                                {t("settings")}
                              </div>
                              <div className="text-xs text-gray-400">
                                {t("accountSettings")}
                              </div>
                            </div>
                          </button>
                        )}

                        {/* Profile Link */}
                        <button
                          type="button"
                          onClick={() => {
                            router.push("/dashboard/settings");
                            setIsMenuOpen(false);
                          }}
                          className="group flex items-center px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-accent w-full"
                        >
                          <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-white">
                              {t("profile")}
                            </div>
                            <div className="text-xs text-gray-400">
                              {t("personalInfo")}
                            </div>
                          </div>
                        </button>

                        {/* Logout Button */}
                        <div className="pt-4 border-t border-gray-700">
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="group flex items-center px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full"
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{t("signOut")}</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={handleSignIn}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          {t("signIn")}
                        </button>
                        <Link
                          href="/signup"
                          onClick={() => setIsMenuOpen(false)}
                          className="w-full bg-transparent border border-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors block text-center"
                        >
                          {t("signUp")}
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
