"use client";

import { EmptyState } from "@/components/dashboard/EmptyState";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useUser";
import { formatPrice } from "@/lib/utils";
import {
  Calendar,
  CalendarCheck,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Plus,
  User,
} from "lucide-react";
import Link from "next/link";

function getTodayStartISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

const TODAY_START = getTodayStartISO();

export default function MyDashboardPage() {
  const { user } = useUser();
  const { t } = useTranslation("dashboard");

  const { data: upcomingReservations, isLoading: loadingUpcoming } =
    trpc.reservation.myReservations.useQuery(
      {
        page: 1,
        limit: 5,
        status: "CONFIRMED",
        startDate: TODAY_START,
      },
      {
        enabled: !!user,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      }
    );

  const { data: allReservations, isLoading: loadingAll } =
    trpc.reservation.myReservations.useQuery(
      {
        page: 1,
        limit: 100,
      },
      {
        enabled: !!user,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      }
    );

  // Calculate client stats
  const activeReservations =
    allReservations?.data.filter((r) => r.status === "CONFIRMED").length ?? 0;

  const totalSpent =
    allReservations?.data
      .filter((r) => r.status === "CONFIRMED" || r.status === "COMPLETED")
      .reduce((sum, r) => sum + Number(r.amount), 0) ?? 0;

  const nextReservation = upcomingReservations?.data[0];

  const nextReservationDate = nextReservation
    ? new Date(nextReservation.startDate).toLocaleDateString("es-PE", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "---";

  if (loadingUpcoming || loadingAll) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("welcome", { name: user?.name || "User" })}`}
        description="Aquí puedes ver tus reservas y gestionar tu perfil"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Active Reservations"
          value={activeReservations}
          subtitle="Confirmed bookings"
          icon={CalendarCheck}
        />

        <KpiCard
          title="Total Spent"
          value={`S/ ${totalSpent.toLocaleString()}`}
          subtitle="All-time spending"
          icon={DollarSign}
        />

        <KpiCard
          title="Next Reservation"
          value={nextReservationDate}
          subtitle={nextReservation?.field.name ?? "No upcoming bookings"}
          icon={Calendar}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Reservations - 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!upcomingReservations || upcomingReservations.data.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming reservations"
                description="You don't have any confirmed reservations yet"
                action={
                  <Link href="/canchas">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Book a Field
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-3">
                {upcomingReservations.data.map((reservation) => (
                  <Link
                    key={reservation.id}
                    href={`/my/reservations/${reservation.id}`}
                  >
                    <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">
                            {reservation.field.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{reservation.field.district}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(
                                reservation.startDate
                              ).toLocaleDateString("es-PE", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}{" "}
                              -{" "}
                              {new Date(
                                reservation.startDate
                              ).toLocaleTimeString("es-PE", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            S/ {formatPrice(Number(reservation.amount))}
                          </p>
                          <Badge
                            variant="soft"
                            className={`mt-1 ${
                              reservation.status === "CONFIRMED" ||
                              reservation.status === "COMPLETED"
                                ? "text-emerald-600"
                                : reservation.status === "PENDING"
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }`}
                          >
                            {t(`statuses.${reservation.status.toLowerCase()}`)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/my/reservations">
                  <Button variant="outline" className="w-full mt-2">
                    View All Reservations
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - 1 column */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/canchas" className="block">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Book a Field</p>
                    <p className="text-sm text-muted-foreground">
                      Browse and reserve sports courts
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/my/reservations" className="block">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">My Reservations</p>
                    <p className="text-sm text-muted-foreground">
                      View all your bookings
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/my/profile" className="block">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">My Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Edit your personal information
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/my/payments" className="block">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Payment History</p>
                    <p className="text-sm text-muted-foreground">
                      View your transactions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
