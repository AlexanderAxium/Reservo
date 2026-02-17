"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { ReservationDetailModal } from "@/components/reservation/ReservationDetailModal";
import { useTranslation } from "@/hooks/useTranslation";
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
    <div className="p-6 space-y-6">
      <PageHeader
        title={t("reservationDetail.title")}
        description={t("reservationDetail.description")}
        backHref="/dashboard/reservations"
      />

      <ReservationDetailModal
        reservationId={reservationId}
        onClose={handleClose}
        fieldHref={(id) => `/dashboard/fields/${id}`}
        onStatusUpdated={() => router.push("/dashboard/reservations")}
      />
    </div>
  );
}
