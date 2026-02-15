"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";
import { Activity, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function MetricsOverviewPage() {
  const { data: metrics, isLoading } = trpc.metrics.tenantOverview.useQuery();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Canchas",
      value: metrics?.totalFields || 0,
      icon: Activity,
      href: "/dashboard/fields",
    },
    {
      title: "Reservas",
      value: metrics?.totalReservations || 0,
      icon: TrendingUp,
      href: "/dashboard/reservations",
      description: `${metrics?.confirmedReservations || 0} confirmadas`,
    },
    {
      title: "Ingresos",
      value: `S/ ${metrics?.revenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      href: "/dashboard/metrics/revenue",
    },
    {
      title: "Clientes",
      value: metrics?.uniqueClients || 0,
      icon: Users,
      href: "/dashboard/clients",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Métricas</h1>
        <p className="text-muted-foreground">Vista general de tu negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.description && (
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    )}
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estado de Reservas</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Confirmadas
                </span>
                <span className="font-medium">
                  {metrics.confirmedReservations}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Pendientes
                </span>
                <span className="font-medium">
                  {metrics.pendingReservations}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Canceladas
                </span>
                <span className="font-medium">
                  {metrics.cancelledReservations}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Periodo</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Desde</span>
                <span className="font-medium">
                  {new Date(metrics.period.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Hasta</span>
                <span className="font-medium">
                  {new Date(metrics.period.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/metrics/revenue">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Ingresos</h3>
            <p className="text-sm text-muted-foreground">
              Ver desglose de ingresos por periodo
            </p>
          </Card>
        </Link>
        <Link href="/dashboard/metrics/occupancy">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-semibold mb-2">Ocupación</h3>
            <p className="text-sm text-muted-foreground">
              Analizar tasas de ocupación de canchas
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
