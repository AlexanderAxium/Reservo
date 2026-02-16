"use client";

import { ManualReservationModal } from "@/components/reservation/ManualReservationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reservations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("reservationNew.back")}
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {t("reservationNew.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("reservationNew.description")}
          </p>
        </div>
      </div>

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
