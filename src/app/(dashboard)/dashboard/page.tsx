"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_HEIGHT = 260;

export default function Dashboard() {
  const { hasPermission } = useRBAC();
  const { t } = useTranslation("dashboard");
  const { data: metrics, isLoading } = trpc.metrics.tenantOverview.useQuery();
  const { data: hoursByDay, isLoading: loadingHours } =
    trpc.metrics.hoursReservedByDay.useQuery({ days: 14 });
  const { data: revenueByDay, isLoading: loadingRevenue } =
    trpc.metrics.revenueByDay.useQuery({ days: 14 });

  const canReadMetrics = hasPermission(
    PermissionAction.READ,
    PermissionResource.METRICS
  );
  const canReadFields = hasPermission(
    PermissionAction.READ,
    PermissionResource.FIELD
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["kpi-1", "kpi-2", "kpi-3", "kpi-4"].map((id) => (
            <Skeleton key={id} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: t("overview.totalReservations"),
      value: metrics?.totalReservations || 0,
      subtitle: t("overview.thisPeriod"),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      show: true,
    },
    {
      title: t("overview.periodRevenue"),
      value: `S/ ${(metrics?.revenue || 0).toLocaleString()}`,
      subtitle: t("overview.xConfirmed", {
        count: String(metrics?.confirmedReservations || 0),
      }),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      href: undefined,
      show: canReadMetrics,
    },
    {
      title: t("overview.activeFields"),
      value: metrics?.totalFields || 0,
      subtitle: t("overview.availableCourts"),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      href: "/dashboard/fields",
      show: canReadFields,
    },
    {
      title: t("overview.pendingConfirmations"),
      value: metrics?.pendingReservations || 0,
      subtitle: t("overview.awaitingAction"),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      href: "/dashboard/reservations",
      show: true,
    },
    {
      title: t("overview.uniqueClients"),
      value: metrics?.uniqueClients || 0,
      subtitle: t("overview.thisPeriod"),
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      href: "/dashboard/clients",
      show: canReadMetrics,
    },
  ];

  const visibleCards = kpiCards.filter((card) => card.show);

  const hoursChartData =
    hoursByDay?.map(({ date, hours }) => ({
      date,
      label: format(parseISO(date), "d MMM", { locale: es }),
      hours,
    })) ?? [];
  const revenueChartData =
    revenueByDay?.map(({ date, revenue }) => ({
      date,
      label: format(parseISO(date), "d MMM", { locale: es }),
      revenue: Number(revenue),
    })) ?? [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("overview.title")}</h1>
        <p className="text-muted-foreground">
          {canReadMetrics
            ? t("overview.descriptionAdmin")
            : t("overview.descriptionStaff")}
        </p>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${visibleCards.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4`}
      >
        {visibleCards.map((card) => {
          const Icon = card.icon;
          const content = (
            <Card
              key={card.title}
              className={
                card.href
                  ? "hover:shadow-md transition-shadow cursor-pointer"
                  : ""
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </CardContent>
            </Card>
          );

          return card.href ? (
            <Link key={card.title} href={card.href}>
              {content}
            </Link>
          ) : (
            <div key={card.title}>{content}</div>
          );
        })}
      </div>

      {/* Gráfico: Horas reservadas por día */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("overview.chartHoursByDay")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("overview.chartHoursByDayDesc")}
          </p>
        </CardHeader>
        <CardContent>
          {loadingHours ? (
            <Skeleton className="w-full" style={{ height: CHART_HEIGHT }} />
          ) : hoursChartData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {t("overview.noChartData")}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart
                data={hoursChartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value} h`,
                    t("overview.chartHoursByDay"),
                  ]}
                  labelFormatter={(label) => label}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Bar
                  dataKey="hours"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Horas"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Gráfico: Ingresos por día */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("overview.chartRevenueByDay")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("overview.chartRevenueByDayDesc")}
          </p>
        </CardHeader>
        <CardContent>
          {loadingRevenue ? (
            <Skeleton className="w-full" style={{ height: CHART_HEIGHT }} />
          ) : revenueChartData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {t("overview.noChartData")}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart
                data={revenueChartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `S/${v}`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `S/ ${value.toLocaleString()}`,
                    t("overview.chartRevenueByDay"),
                  ]}
                  labelFormatter={(label) => label}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(142, 76%, 36%)"
                  radius={[4, 4, 0, 0]}
                  name="Ingresos"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/reservations">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">
                {t("overview.viewReservations")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("overview.viewReservationsDesc")}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/reservations/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">
                {t("overview.createReservation")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("overview.createReservationDesc")}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/fields">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">
                {t("overview.browseFields")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("overview.browseFieldsDesc")}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
