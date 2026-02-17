"use client";
import { authClient } from "@/lib/auth-client";
import type { AuthUser } from "@/types/user";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SessionData {
  user?: {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (_error) {
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const handleStorageChange = () => {
      getSession();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check session periodically
    const interval = setInterval(getSession, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/auth/redirect",
        rememberMe: true,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Refresh session after successful login
      const { data } = await authClient.getSession();
      setSession(data);

      return { success: true };
    } catch (_error) {
      return { success: false, error: "Error de red o servidor" };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/redirect",
        errorCallbackURL: "/signin",
        newUserCallbackURL: "/auth/redirect",
      });

      // Refresh session after successful login
      const { data } = await authClient.getSession();
      setSession(data);
    } catch (_error) {
      // Error handled by Better Auth
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Clear impersonation cookie so it doesn't leak into the next session
      document.cookie = "x-tenant-override=; path=/; max-age=0; SameSite=Lax";
      localStorage.removeItem("x-tenant-override-name");

      await authClient.signOut();
      const { data } = await authClient.getSession();
      setSession(data);
    } catch (_error) {
      // Error handled by Better Auth
    }
  }, []);

  const user: AuthUser | null = useMemo(
    () =>
      session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name || "",
            phone: session.user.phone || null,
            image: session.user.image || null,
            emailVerified: session.user.emailVerified || false,
            language: "es",
            createdAt: session.user.createdAt,
            updatedAt: session.user.updatedAt,
          }
        : null,
    [session]
  );

  const isAuthenticated = !!user;

  const auth = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      signIn,
      signInWithGoogle,
      signOut,
      isAuthenticated,
    }),
    [user, loading, signIn, signInWithGoogle, signOut, isAuthenticated]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
