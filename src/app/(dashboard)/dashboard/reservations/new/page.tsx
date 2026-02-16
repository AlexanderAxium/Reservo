"use client";

import { ManualReservationModal } from "@/components/reservation/ManualReservationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/hooks/useTRPC";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewReservationPage() {
  const router = useRouter();
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
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Nueva Reserva Manual
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Crea una reserva para un cliente o invitado
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Utiliza el formulario para crear una nueva reserva manual.
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
