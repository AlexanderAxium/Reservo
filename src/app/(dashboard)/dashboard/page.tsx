"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";
import { useUser } from "@/hooks/useUser";
import {
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { isTenantAdmin, isTenantStaff } = useUser();
  const { data: metrics, isLoading } = trpc.metrics.tenantOverview.useQuery();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  // Define KPI cards based on role
  const kpiCards = [
    {
      title: "Total Reservations",
      value: metrics?.totalReservations || 0,
      subtitle: "This period",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      show: true,
    },
    {
      title: "Period Revenue",
      value: `S/ ${(metrics?.revenue || 0).toLocaleString()}`,
      subtitle: `${metrics?.confirmedReservations || 0} confirmed`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      href: isTenantAdmin ? "/dashboard/metrics/revenue" : undefined,
      show: isTenantAdmin, // Only show to admins
    },
    {
      title: "Active Fields",
      value: metrics?.totalFields || 0,
      subtitle: "Available courts",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      href: "/dashboard/fields",
      show: isTenantAdmin, // Only show to admins
    },
    {
      title: "Pending Confirmations",
      value: metrics?.pendingReservations || 0,
      subtitle: "Awaiting action",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      href: "/dashboard/reservations",
      show: true,
    },
    {
      title: "Unique Clients",
      value: metrics?.uniqueClients || 0,
      subtitle: "This period",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      href: "/dashboard/clients",
      show: isTenantAdmin, // Only show to admins
    },
  ];

  const visibleCards = kpiCards.filter((card) => card.show);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {isTenantAdmin
            ? "Overview of your business performance and key metrics."
            : "Overview of today's reservations and pending items."}
        </p>
      </div>

      {/* KPI Cards */}
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

      {/* TODO: Most Booked Field - implement when backend provides this data */}

      {/* Quick Links for Staff */}
      {isTenantStaff && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/reservations">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">View Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage and view all reservations
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/reservations/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Create Reservation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add a new manual reservation
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/fields">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Browse Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View all available fields
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}
