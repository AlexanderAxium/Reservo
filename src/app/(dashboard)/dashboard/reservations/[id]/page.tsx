"use client";

import { ReservationDetailModal } from "@/components/reservation/ReservationDetailModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params.id as string;

  const handleClose = () => {
    router.push("/dashboard/reservations");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reservations">
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
            Información completa y acciones disponibles
          </p>
        </div>
      </div>

      <ReservationDetailModal
        reservationId={reservationId}
        onClose={handleClose}
        fieldHref={(id) => `/dashboard/fields/${id}`}
        onStatusUpdated={() => router.push("/dashboard/reservations")}
      />
    </div>
  );
}
