"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { ManualReservationModal } from "@/components/reservation/ManualReservationModal";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewReservationPage() {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const [modalOpen, setModalOpen] = useState(true);

  const { data: fieldsData } = trpc.field.getAll.useQuery({
    page: 1,
    limit: 100,
    available: true,
  });

  const fields =
    fieldsData?.data.map((f) => ({
      id: f.id,
      name: f.name,
      price: Number(f.price),
    })) || [];

  const handleClose = () => {
    setModalOpen(false);
    router.push("/dashboard/reservations");
  };

  const handleSuccess = () => {
    router.push("/dashboard/reservations");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("reservationNew.title")}
        description={t("reservationNew.description")}
        backHref="/dashboard/reservations"
      />

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            {t("reservationNew.formHint")}
          </p>
        </CardContent>
      </Card>

      <ManualReservationModal
        open={modalOpen}
        onOpenChange={handleClose}
        fields={fields}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
