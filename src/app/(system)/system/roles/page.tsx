"use client";

import { FilterBar } from "@/components/dashboard/FilterBar";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { Shield } from "lucide-react";
import { useState } from "react";

export default function RolesAndPermissions() {
  const { t } = useTranslation("dashboard");
  const { data: roles, isLoading } = trpc.rbac.getAllRoles.useQuery();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const filteredRoles = roles?.data?.filter((role) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      role.name.toLowerCase().includes(q) ||
      role.displayName?.toLowerCase().includes(q) ||
      (role.description?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={t("system.rolesAndPermissions")}
        description={t("system.rolesDesc")}
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("system.searchRolesPlaceholder")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles?.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {role.name}
                </CardTitle>
                <Badge
                  variant="soft"
                  className={
                    role.isActive ? "text-emerald-600" : "text-red-600"
                  }
                >
                  {role.isActive ? t("system.active") : t("system.inactive")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {role.description || t("system.noDescription")}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {role.rolePermissions?.length ?? 0}{" "}
                {t("system.permissionsCount")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
