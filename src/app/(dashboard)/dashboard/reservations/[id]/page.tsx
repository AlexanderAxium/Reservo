"use client";

import { ReservationDetailModal } from "@/components/reservation/ReservationDetailModal";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation("dashboard");
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
            {t("reservationDetail.back")}
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {t("reservationDetail.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("reservationDetail.description")}
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
