"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useImpersonation } from "@/hooks/useImpersonation";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft, Building2, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/** Shown to sys_admin users who navigate to /dashboard without selecting a tenant. */
export function TenantPicker() {
  const { t } = useTranslation("dashboard");
  const { startImpersonation } = useImpersonation();
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.tenant.list.useQuery(
    { page: 1, limit: 50, search: search || undefined },
    { staleTime: 60_000 }
  );

  const tenants = data?.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/system"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("system.backToSystem")}
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("system.selectTenantTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("system.selectTenantDesc")}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("system.searchOrganization")}
            className="pl-9"
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : tenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t("system.noOrganizations")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tenants.map((tenant) => (
              <Card
                key={tenant.id}
                className="transition-colors hover:bg-muted/50 cursor-pointer"
                onClick={() =>
                  startImpersonation({
                    id: tenant.id,
                    name: tenant.displayName || tenant.name,
                  })
                }
              >
                <CardContent className="flex items-center justify-between py-4 px-5">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {tenant.displayName || tenant.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="truncate">{tenant.slug}</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {tenant._count?.users ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 ml-4">
                    {t("system.enterDashboardAs")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
