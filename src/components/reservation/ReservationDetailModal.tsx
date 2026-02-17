"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/hooks/useTRPC";
import { formatPrice } from "@/lib/utils";
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

const SPORT_LABELS: Record<string, string> = {
  FOOTBALL: "Fútbol",
  TENNIS: "Tenis",
  BASKETBALL: "Básquet",
  VOLLEYBALL: "Vóley",
  FUTSAL: "Futsal",
  PADEL: "Pádel",
  MULTI_PURPOSE: "Multiuso",
  OTHER: "Otro",
};

function StatusBadge({ status }: { status: string }) {
  const base =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium";
  if (status === "CONFIRMED" || status === "COMPLETED") {
    return (
      <span
        className={`${base} border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`}
      >
        {STATUS_LABELS[status] ?? status}
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span
        className={`${base} border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400`}
      >
        {STATUS_LABELS[status] ?? status}
      </span>
    );
  }
  if (status === "CANCELLED" || status === "NO_SHOW") {
    return (
      <span
        className={`${base} border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400`}
      >
        {STATUS_LABELS[status] ?? status}
      </span>
    );
  }
  return (
    <span className={`${base} border-border bg-muted text-muted-foreground`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

interface ReservationDetailModalProps {
  reservationId: string | null;
  onClose: () => void;
  fieldHref: (fieldId: string) => string;
  onStatusUpdated?: () => void;
}

export function ReservationDetailModal({
  reservationId,
  onClose,
  fieldHref,
  onStatusUpdated,
}: ReservationDetailModalProps) {
  const utils = trpc.useUtils();
  const id = reservationId ?? "";
  const { data: reservation, isLoading } = trpc.reservation.getById.useQuery(
    { id },
    { enabled: !!reservationId }
  );

  const updateStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => {
      utils.reservation.getById.invalidate({ id });
      utils.reservation.listForTenant.invalidate();
      utils.reservation.listForAdmin.invalidate();
      toast.success("Estado de reserva actualizado");
      onStatusUpdated?.();
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo actualizar");
    },
  });

  const open = !!reservationId;
  const canConfirm = reservation?.status === "PENDING";
  const canCancel =
    reservation?.status === "PENDING" || reservation?.status === "CONFIRMED";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-card border-border text-foreground max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
          <DialogTitle className="text-foreground">
            Detalle de la reserva
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Información completa y acciones disponibles
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground px-6">
            Cargando reserva...
          </div>
        ) : !reservation ? (
          <div className="py-8 text-center text-muted-foreground px-6">
            No se encontró la reserva
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-2">
              <div className="space-y-5 py-2">
                <div className="rounded-lg border border-border bg-muted/30 dark:bg-muted/10 p-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {reservation.field.name}
                      </p>
                      <p className="text-muted-foreground">
                        {SPORT_LABELS[reservation.field.sport] ??
                          reservation.field.sport}
                        {reservation.field.district &&
                          ` • ${reservation.field.district}`}
                      </p>
                      {reservation.field.address && (
                        <p className="text-muted-foreground text-xs mt-1">
                          {reservation.field.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        {reservation.user?.name ??
                          reservation.guestName ??
                          "Invitado"}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {reservation.user?.email ??
                          reservation.guestEmail ??
                          "—"}
                      </p>
                      {(reservation.guestPhone || reservation.user?.phone) && (
                        <p className="text-muted-foreground text-xs">
                          Tel:{" "}
                          {reservation.guestPhone ??
                            reservation.user?.phone ??
                            "—"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="text-foreground">
                      {new Date(reservation.startDate).toLocaleDateString(
                        "es-PE",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="text-foreground">
                      {new Date(reservation.startDate).toLocaleTimeString(
                        "es-PE",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                      –{" "}
                      {new Date(reservation.endDate).toLocaleTimeString(
                        "es-PE",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Monto</span>
                    <span className="font-semibold text-foreground">
                      S/ {formatPrice(Number(reservation.amount))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Estado</span>
                    <StatusBadge status={reservation.status} />
                  </div>
                </div>

                {reservation.payments && reservation.payments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pagos
                    </p>
                    <ul className="space-y-2 rounded-lg border border-border bg-muted/20 p-3 text-sm">
                      {reservation.payments.map((p) => (
                        <li
                          key={p.id}
                          className="flex justify-between items-center text-foreground"
                        >
                          <span>{p.paymentMethod?.name ?? "—"}</span>
                          <span>
                            S/ {formatPrice(Number(p.amount))} ({p.status})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="shrink-0 flex-wrap gap-2 justify-end pt-3 pb-6 px-6 border-t border-border bg-card">
              <Button variant="outline" size="sm" asChild>
                <Link href={fieldHref(reservation.field.id)}>Ver cancha</Link>
              </Button>
              {canConfirm && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() =>
                    updateStatus.mutate({
                      id: reservation.id,
                      status: "CONFIRMED",
                    })
                  }
                  disabled={updateStatus.isPending}
                >
                  {updateStatus.isPending ? "Procesando..." : "Confirmar"}
                </Button>
              )}
              {canCancel && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    updateStatus.mutate({
                      id: reservation.id,
                      status: "CANCELLED",
                    })
                  }
                  disabled={updateStatus.isPending}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={onClose}>
                Cerrar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
