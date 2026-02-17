"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/hooks/useTRPC";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Calendar, Clock, MapPin, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

export default function MyReservationDetailPage() {
  const params = useParams();
  const reservationId = params.id as string;

  const { data: reservation, isLoading } = trpc.reservation.getById.useQuery({
    id: reservationId,
  });

  // TODO: Implement cancel mutation when reservation.cancel endpoint is created
  // const cancelMutation = trpc.reservation.cancel.useMutation({
  //   onSuccess: () => {
  //     toast.success("Reserva cancelada correctamente");
  //     refetch();
  //   },
  //   onError: (error: any) => {
  //     toast.error(error.message || "Error al cancelar reserva");
  //   },
  // });

  const handleCancel = () => {
    // TODO: Implement cancel when endpoint is available
    toast.error("Funcionalidad de cancelación en desarrollo");
    // if (
    //   confirm(
    //     "¿Estás seguro de cancelar esta reserva? Esta acción no se puede deshacer."
    //   )
    // ) {
    //   cancelMutation.mutate({ id: reservationId });
    // }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Cargando...</div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Reserva no encontrada</div>
      </div>
    );
  }

  const canCancel =
    reservation.status === "PENDING" || reservation.status === "CONFIRMED";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/my/reservations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Detalle de Reserva
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Información completa de tu reserva
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {reservation.field.name}
          </CardTitle>
          <p className="text-muted-foreground">
            {reservation.field.district} • {reservation.field.sport}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fecha
                </p>
                <p className="text-base">
                  {new Date(reservation.startDate).toLocaleDateString("es-PE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Horario
                </p>
                <p className="text-base">
                  {new Date(reservation.startDate).toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(reservation.endDate).toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monto Total</span>
              <span className="text-2xl font-bold">
                S/ {formatPrice(Number(reservation.amount))}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estado</span>
            <Badge
              variant="soft"
              className={
                reservation.status === "CONFIRMED" ||
                reservation.status === "COMPLETED"
                  ? "text-emerald-600"
                  : reservation.status === "PENDING"
                    ? "text-amber-600"
                    : "text-red-600"
              }
            >
              {STATUS_LABELS[reservation.status] || reservation.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {reservation.field.address && (
        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">{reservation.field.address}</p>
            {/* TODO: Add googleMapsUrl to field query and show "Ver en Google Maps" link */}
          </CardContent>
        </Card>
      )}

      {canCancel && (
        <Button
          onClick={handleCancel}
          variant="destructive"
          className="w-full md:w-auto"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Cancelar Reserva
        </Button>
      )}
    </div>
  );
}
