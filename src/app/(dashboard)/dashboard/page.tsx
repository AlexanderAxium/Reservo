"use client";

import { ChartCard } from "@/components/dashboard/ChartCard";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsBarChart } from "@/components/dashboard/StatsBarChart";
import { StatsDonutChart } from "@/components/dashboard/StatsDonutChart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { format, parseISO, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_HEIGHT = 280;

export default function Dashboard() {
  const { hasPermission, isTenantAdmin } = useRBAC();
  const { t } = useTranslation("dashboard");

  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: trendData, isLoading: loadingTrends } =
    trpc.metrics.tenantOverviewWithTrends.useQuery({
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    });

  const { data: statusData, isLoading: loadingStatus } =
    trpc.metrics.reservationsByStatus.useQuery({
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    });

  const { data: weeklyData, isLoading: loadingWeekly } =
    trpc.metrics.reservationsByWeek.useQuery({ weeks: 8 });

  const { data: revenueByDay, isLoading: loadingRevenue } =
    trpc.metrics.revenueByDay.useQuery({ days: 14 });

  const { data: upcomingReservations, isLoading: loadingUpcoming } =
    trpc.reservation.getUpcomingForOwner.useQuery({ limit: 6 });

  const canReadMetrics = hasPermission(
    PermissionAction.READ,
    PermissionResource.METRICS
  );

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, isPositive: current > 0 };
    const trendValue = ((current - previous) / previous) * 100;
    return { value: trendValue, isPositive: trendValue >= 0 };
  };

  const current = trendData?.current;
  const previous = trendData?.previous;

  const revenueChartData =
    revenueByDay?.map(({ date, revenue }) => ({
      date,
      label: format(parseISO(date), "d MMM", { locale: es }),
      revenue: Number(revenue),
    })) ?? [];

  const weeklyChartData =
    weeklyData?.map((item) => ({
      week: format(parseISO(item.week), "MMM d", { locale: es }),
      confirmed: item.confirmed,
      pending: item.pending,
      cancelled: item.cancelled,
    })) ?? [];

  const statusKeyMap: Record<string, string> = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    NO_SHOW: "noShow",
  };

  const donutChartData =
    statusData?.map((item) => ({
      name: t(
        `statuses.${statusKeyMap[item.status] ?? item.status.toLowerCase()}`
      ),
      value: item.count,
      color: item.color,
    })) ?? [];

  const statusColorMap: Record<string, string> = {
    PENDING: "text-amber-600 dark:text-amber-400 border-amber-600/20",
    CONFIRMED: "text-blue-600 dark:text-blue-400 border-blue-600/20",
    COMPLETED: "text-emerald-600 dark:text-emerald-400 border-emerald-600/20",
    CANCELLED: "text-red-600 dark:text-red-400 border-red-600/20",
    NO_SHOW: "text-zinc-600 dark:text-zinc-400 border-zinc-600/20",
  };

  if (loadingTrends) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[360px]" />
          <Skeleton className="h-[360px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={t("overview.title")}
        description={
          isTenantAdmin
            ? t("overview.descriptionAdmin")
            : t("overview.descriptionStaff")
        }
        actions={
          <DateRangePicker dateRange={dateRange} onChange={setDateRange} />
        }
      />

      {/* KPI Cards - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title={t("overview.totalReservations")}
          value={current?.totalReservations ?? 0}
          subtitle={t("overview.thisPeriod")}
          icon={Calendar}
          trend={
            current && previous
              ? calculateTrend(
                  current.totalReservations,
                  previous.totalReservations
                )
              : undefined
          }
        />

        {canReadMetrics ? (
          <KpiCard
            title={t("overview.periodRevenue")}
            value={`S/ ${(current?.revenue ?? 0).toLocaleString()}`}
            subtitle={t("overview.thisPeriod")}
            icon={DollarSign}
            trend={
              current && previous
                ? calculateTrend(current.revenue, previous.revenue)
                : undefined
            }
          />
        ) : (
          <KpiCard
            title={t("overview.pendingConfirmations")}
            value={current?.pendingConfirmations ?? 0}
            subtitle={t("overview.awaitingAction")}
            icon={Clock}
            trend={
              current && previous
                ? calculateTrend(
                    current.pendingConfirmations,
                    previous.pendingConfirmations
                  )
                : undefined
            }
          />
        )}

        {canReadMetrics ? (
          <KpiCard
            title={t("overview.uniqueClients")}
            value={current?.uniqueClients ?? 0}
            subtitle={t("overview.thisPeriod")}
            icon={Users}
            trend={
              current && previous
                ? calculateTrend(current.uniqueClients, previous.uniqueClients)
                : undefined
            }
          />
        ) : (
          <KpiCard
            title={t("overview.pendingConfirmations")}
            value={current?.pendingConfirmations ?? 0}
            subtitle={t("overview.awaitingAction")}
            icon={Clock}
          />
        )}
      </div>

      {/* Row 2: Stacked Bar + Revenue Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title={t("overview.reservationsByWeek")}
          description={t("overview.last8Weeks")}
          isLoading={loadingWeekly}
          isEmpty={weeklyChartData.length === 0}
          emptyMessage={t("overview.noChartData")}
          className="lg:col-span-2"
        >
          <StatsBarChart
            data={weeklyChartData}
            xAxisKey="week"
            height={CHART_HEIGHT}
            bars={[
              {
                dataKey: "confirmed",
                name: t("statuses.confirmed"),
                color: "var(--color-chart-1)",
                stackId: "stack",
              },
              {
                dataKey: "pending",
                name: t("statuses.pending"),
                color: "var(--color-chart-3)",
                stackId: "stack",
              },
              {
                dataKey: "cancelled",
                name: t("statuses.cancelled"),
                color: "var(--color-chart-5)",
                stackId: "stack",
              },
            ]}
            showLegend
          />
        </ChartCard>

        <ChartCard
          title={t("overview.reservationsByStatus")}
          description={t("overview.statusDistribution")}
          isLoading={loadingStatus}
          isEmpty={donutChartData.length === 0}
          emptyMessage={t("overview.noChartData")}
        >
          <StatsDonutChart
            data={donutChartData}
            centerLabel={t("overview.total")}
            centerValue={donutChartData.reduce(
              (sum, item) => sum + item.value,
              0
            )}
            height={CHART_HEIGHT}
          />
        </ChartCard>
      </div>

      {/* Row 3: Revenue Area Chart + Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={t("overview.chartRevenueByDay")}
          description={t("overview.chartRevenueByDayDesc")}
          isLoading={loadingRevenue}
          isEmpty={revenueChartData.length === 0}
          emptyMessage={t("overview.noChartData")}
        >
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <AreaChart
              data={revenueChartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="gradientRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `S/${v}`}
                className="fill-muted-foreground"
              />
              <Tooltip
                formatter={(value: number) => [
                  `S/ ${value.toLocaleString()}`,
                  t("overview.chartRevenueByDay"),
                ]}
                labelFormatter={(label) => label}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover, 0 0% 100%))",
                  border: "1px solid hsl(var(--border, 240 5.9% 90%))",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#gradientRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent / Upcoming Reservations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base font-semibold">
                {t("overview.upcomingReservations")}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t("overview.upcomingReservationsDesc")}
              </p>
            </div>
            <Link
              href="/dashboard/reservations"
              className="text-xs font-medium text-primary hover:underline"
            >
              {t("overview.seeAll")}
            </Link>
          </CardHeader>
          <CardContent>
            {loadingUpcoming ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : !upcomingReservations || upcomingReservations.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  {t("overview.noUpcomingReservations")}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {upcomingReservations.map((reservation) => (
                  <Link
                    key={reservation.id}
                    href={`/dashboard/reservations/${reservation.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {reservation.user?.name ?? t("overview.guest")}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {reservation.field?.name} &middot;{" "}
                        {format(
                          new Date(reservation.startDate),
                          "d MMM, HH:mm",
                          {
                            locale: es,
                          }
                        )}
                      </p>
                    </div>
                    <Badge
                      variant="soft"
                      className={cn(
                        "shrink-0 rounded px-2",
                        statusColorMap[reservation.status] ??
                          "text-muted-foreground"
                      )}
                    >
                      {t(
                        `statuses.${statusKeyMap[reservation.status] ?? reservation.status.toLowerCase()}`
                      )}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
