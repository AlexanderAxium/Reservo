"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/hooks/useTRPC";
import { useUser } from "@/hooks/useUser";
import { formatPrice } from "@/lib/utils";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

export default function MyDashboardPage() {
  const { user } = useUser();

  const { data: upcomingReservations } =
    trpc.reservation.myReservations.useQuery(
      {
        page: 1,
        limit: 5,
        status: "CONFIRMED",
        startDate: new Date().toISOString(),
      },
      { enabled: !!user }
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bienvenido, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver tus reservas y gestionar tu perfil
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Reservas
            </CardTitle>
            <CardDescription>
              Tus reservas confirmadas de los próximos 7 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!upcomingReservations || upcomingReservations.data.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No tienes reservas próximas
                </p>
                <Link href="/canchas">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Reservar Cancha
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingReservations.data.map((reservation) => (
                  <Link
                    key={reservation.id}
                    href={`/my/reservations/${reservation.id}`}
                  >
                    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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
                          <Badge variant="outline" className="mt-1">
                            {STATUS_LABELS[reservation.status]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/my/reservations">
                  <Button variant="outline" className="w-full">
                    Ver Todas las Reservas
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/canchas">
              <Button className="w-full" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Reservar una Cancha
              </Button>
            </Link>
            <Link href="/my/reservations">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Mis Reservas
              </Button>
            </Link>
            <Link href="/my/profile">
              <Button variant="outline" className="w-full">
                Editar Perfil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
