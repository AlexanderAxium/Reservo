"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { trpc } from "@/hooks/useTRPC";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function OwnerPendingAlerts() {
  const { data: pendingCount, isLoading } =
    trpc.reservation.getOwnerPendingCount.useQuery();

  if (isLoading || pendingCount === undefined || pendingCount === 0) {
    return null;
  }

  return (
    <Alert variant="default" className="border-amber-500/50 bg-amber-500/5">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle>Reservas pendientes de confirmar</AlertTitle>
      <AlertDescription>
        Tienes <strong>{pendingCount}</strong>{" "}
        {pendingCount === 1 ? "reserva pendiente" : "reservas pendientes"} de
        confirmar.{" "}
        <Link
          href="/dashboard/reservations?status=PENDING"
          className="font-medium text-primary underline underline-offset-2 hover:no-underline"
        >
          Ver y gestionar
        </Link>
      </AlertDescription>
    </Alert>
  );
}
