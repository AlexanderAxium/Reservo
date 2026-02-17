"use client";

import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { Building2, Calendar, DollarSign, MapPin, Users } from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function SystemDashboard() {
  const { t } = useTranslation("dashboard");
  const { data: globalMetrics, isLoading } =
    trpc.metrics.globalOverview.useQuery();
  const { data: tenantRanking, isLoading: loadingRanking } =
    trpc.metrics.tenantRanking.useQuery({ limit: 5 });
  const { data: tenants } = trpc.tenant.list.useQuery({ page: 1, limit: 5 });

  const topTenantsData =
    tenantRanking?.map((t) => ({
      name: t.tenantName,
      revenue: Number(t.revenue),
    })) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("system.title")}
        description={t("system.dashboardDesc")}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title={t("system.totalTenants")}
          value={globalMetrics?.totalTenants || 0}
          subtitle={t("system.activeOrganizations")}
          icon={Building2}
        />

        <KpiCard
          title={t("system.totalUsers")}
          value={globalMetrics?.totalUsers || 0}
          subtitle={t("system.platformWide")}
          icon={Users}
        />

        <KpiCard
          title={t("system.totalFields")}
          value={globalMetrics?.totalFields || 0}
          subtitle={t("system.allOrganizations")}
          icon={MapPin}
        />

        <KpiCard
          title={t("system.totalRevenue")}
          value={`S/ ${(globalMetrics?.revenue || 0).toLocaleString()}`}
          subtitle={t("system.platformRevenue")}
          icon={DollarSign}
        />
      </div>

      {/* Revenue by Tenant Chart */}
      <ChartCard
        title={t("system.revenueByTenant")}
        description={t("system.top5Revenue")}
        isLoading={loadingRanking}
        isEmpty={topTenantsData.length === 0}
        emptyMessage={t("system.noRevenueData")}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topTenantsData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              className="text-xs fill-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-xs fill-muted-foreground"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `S/${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover, 0 0% 100%))",
                border: "1px solid hsl(var(--border, 240 5.9% 90%))",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
              formatter={(value: number) => [
                `S/ ${value.toLocaleString()}`,
                t("system.revenue"),
              ]}
            />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Recent Organizations Table */}
      {tenants?.data && tenants.data.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                {t("system.recentOrganizations")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("system.latestTenants")}
              </p>
            </div>
            <Link
              href="/system/organizations"
              className="text-sm text-primary hover:underline"
            >
              {t("system.viewAll")}
            </Link>
          </div>
          <div className="space-y-3">
            {tenants.data.map((tenant) => (
              <Link
                key={tenant.id}
                href={`/system/organizations/${tenant.id}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {tenant.displayName || tenant.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{tenant.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{tenant.plan}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
