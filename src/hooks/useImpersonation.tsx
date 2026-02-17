"use client";

import { useRouter } from "next/navigation";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ImpersonatedTenant {
  id: string;
  name: string;
}

interface ImpersonationContextType {
  impersonatedTenant: ImpersonatedTenant | null;
  startImpersonation: (tenant: ImpersonatedTenant) => void;
  stopImpersonation: () => void;
  isImpersonating: boolean;
}

const ImpersonationContext = createContext<ImpersonationContextType>({
  impersonatedTenant: null,
  startImpersonation: () => {},
  stopImpersonation: () => {},
  isImpersonating: false,
});

const COOKIE_NAME = "x-tenant-override";
const STORAGE_KEY = "x-tenant-override-name";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return match ? (match.split("=")[1] ?? null) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [impersonatedTenant, setImpersonatedTenant] =
    useState<ImpersonatedTenant | null>(null);

  useEffect(() => {
    const tenantId = getCookie(COOKIE_NAME);
    const tenantName =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (tenantId && tenantName) {
      setImpersonatedTenant({ id: tenantId, name: tenantName });
    }
  }, []);

  const startImpersonation = useCallback(
    (tenant: ImpersonatedTenant) => {
      setCookie(COOKIE_NAME, tenant.id);
      localStorage.setItem(STORAGE_KEY, tenant.name);
      setImpersonatedTenant(tenant);
      router.push("/dashboard");
    },
    [router]
  );

  const stopImpersonation = useCallback(() => {
    deleteCookie(COOKIE_NAME);
    localStorage.removeItem(STORAGE_KEY);
    setImpersonatedTenant(null);
    router.push("/system");
  }, [router]);

  return (
    <ImpersonationContext.Provider
      value={{
        impersonatedTenant,
        startImpersonation,
        stopImpersonation,
        isImpersonating: impersonatedTenant !== null,
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  );
}

export function useImpersonation() {
  return useContext(ImpersonationContext);
}
