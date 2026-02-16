"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/hooks/useTRPC";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

export function OwnerNextReservations() {
  const { data: upcoming, isLoading } =
    trpc.reservation.getUpcomingForOwner.useQuery({ limit: 5 });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Próximas reservas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  if (!upcoming?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Próximas reservas
          </CardTitle>
          <CardDescription>No tienes reservas programadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard/owner/reservations"
            className="text-sm text-primary hover:underline"
          >
            Ver todas las reservas
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Próximas reservas
        </CardTitle>
        <CardDescription>Próximas {upcoming.length} reservas</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {upcoming.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border p-2 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{r.field.name}</p>
                <p className="text-muted-foreground text-xs">
                  {format(new Date(r.startDate), "EEE d MMM, HH:mm", {
                    locale: es,
                  })}{" "}
                  · {r.user?.name ?? r.guestName ?? "Invitado"}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </li>
          ))}
        </ul>
        <Link
          href="/dashboard/owner/reservations"
          className="mt-3 block text-center text-sm text-primary hover:underline"
        >
          Ver todas las reservas
        </Link>
      </CardContent>
    </Card>
  );
}
