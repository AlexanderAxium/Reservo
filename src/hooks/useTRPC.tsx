"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import React, { useMemo } from "react";
import type { AppRouter } from "../server/routers/_app";

export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  const trpcClient = useMemo(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url:
            typeof window !== "undefined"
              ? `${window.location.origin}/api/trpc`
              : "/api/trpc",
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
          headers() {
            const token =
              typeof window !== "undefined"
                ? localStorage.getItem("auth_token")
                : null;
            const tenantOverride =
              typeof document !== "undefined"
                ? document.cookie
                    .split("; ")
                    .find((c) => c.startsWith("x-tenant-override="))
                    ?.split("=")[1]
                : undefined;
            return {
              ...(token ? { authorization: `Bearer ${token}` } : {}),
              ...(tenantOverride
                ? { "x-tenant-override": tenantOverride }
                : {}),
            };
          },
        }),
      ],
    });
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
