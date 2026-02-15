"use client";

import { ReservationCalendar } from "@/components/fields/ReservationCalendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/hooks/useTRPC";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ReservationCalendarPage() {
  const [selectedFieldId, setSelectedFieldId] = useState<string>("");

  const { data: fieldsData } = trpc.field.getAll.useQuery({
    page: 1,
    limit: 100,
  });

  const fields = fieldsData?.data || [];
  const selectedField = fields.find((f) => f.id === selectedFieldId);

  const { data: schedulesData } = trpc.field.getSchedules.useQuery(
    { fieldId: selectedFieldId },
    { enabled: !!selectedFieldId }
  );

  const { data: reservationsData } = trpc.reservation.listForTenant.useQuery(
    {
      page: 1,
      limit: 1000,
      fieldId: selectedFieldId,
    },
    { enabled: !!selectedFieldId }
  );

  const schedules = schedulesData || [];
  const reservations =
    reservationsData?.data.map((r) => ({
      id: r.id,
      startDate: r.startDate.toISOString(),
      endDate: r.endDate.toISOString(),
      status: r.status as
        | "PENDING"
        | "CONFIRMED"
        | "CANCELLED"
        | "COMPLETED"
        | "NO_SHOW",
      amount: Number(r.amount),
      clientName: r.user?.name || r.guestName || "Invitado",
    })) || [];

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
            Calendario de Reservas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Vista semanal de reservas por cancha
          </p>
        </div>
      </div>

      <div className="max-w-xs">
        <label
          htmlFor="field-select"
          className="text-sm font-medium mb-2 block"
        >
          Selecciona una cancha
        </label>
        <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
          <SelectTrigger id="field-select">
            <SelectValue placeholder="Elige una cancha..." />
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.name} - {field.sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedFieldId && selectedField ? (
        <ReservationCalendar
          fieldId={selectedFieldId}
          schedules={schedules}
          reservations={reservations}
          fieldHref={(id) => `/dashboard/fields/${id}`}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Selecciona una cancha para ver el calendario de reservas
        </div>
      )}
    </div>
  );
}
