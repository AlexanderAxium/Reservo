"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useImpersonation } from "@/hooks/useImpersonation";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ArrowLeft,
  Building2,
  Edit,
  ExternalLink,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function OrganizationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const { t } = useTranslation("dashboard");
  const { startImpersonation } = useImpersonation();
  const { data: tenant, isLoading } = trpc.tenant.getById.useQuery({
    id: unwrappedParams.id,
  });
  const { data: stats } = trpc.tenant.getStats.useQuery({
    id: unwrappedParams.id,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-6">
        <p>{t("system.organizationNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/system/organizations">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{tenant.name}</h1>
            <p className="text-muted-foreground">{tenant.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            onClick={() =>
              startImpersonation({
                id: tenant.id,
                name: tenant.displayName || tenant.name,
              })
            }
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {t("system.enterDashboard")}
          </Button>
          <Link href={`/system/organizations/${unwrappedParams.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              {t("system.edit")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("system.totalFields")}
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalFields || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t("system.ofAllowed", { max: String(tenant.maxFields) })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("system.totalUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {t("system.ofAllowed", { max: String(tenant.maxUsers) })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("system.reservations")}
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalReservations || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("system.totalBookings")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("system.organizationDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("system.displayName")}
              </p>
              <p className="text-base">{tenant.displayName}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("system.email")}
              </p>
              <p className="text-base">{tenant.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("system.plan")}
              </p>
              <Badge variant="outline">{tenant.plan.toUpperCase()}</Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("system.status")}
              </p>
              <Badge
                variant="soft"
                className={
                  tenant.isActive ? "text-emerald-600" : "text-red-600"
                }
              >
                {tenant.isActive ? t("system.active") : t("system.inactive")}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("system.created")}
              </p>
              <p className="text-base">
                {new Date(tenant.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("system.lastUpdated")}
              </p>
              <p className="text-base">
                {new Date(tenant.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
