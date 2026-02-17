"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { ReservationCalendar } from "@/components/fields/ReservationCalendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";

export default function ReservationCalendarPage() {
  const { t } = useTranslation("dashboard");
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
      startDate: String(r.startDate),
      endDate: String(r.endDate),
      status: r.status,
      amount: Number(r.amount),
      clientName: r.user?.name || r.guestName || t("reservationCalendar.guest"),
    })) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("reservationCalendar.title")}
        description={t("reservationCalendar.description")}
        backHref="/dashboard/reservations"
      />

      <div className="max-w-xs">
        <Label htmlFor="field-select" className="mb-2 block">
          {t("reservationCalendar.selectField")}
        </Label>
        <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
          <SelectTrigger id="field-select">
            <SelectValue
              placeholder={t("reservationCalendar.fieldPlaceholder")}
            />
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
          fieldName={selectedField.name}
          fieldPrice={Number(selectedField.price)}
          schedules={schedules}
          reservations={reservations}
          fieldHref={(id) => `/dashboard/fields/${id}`}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {t("reservationCalendar.selectFieldHint")}
        </div>
      )}
    </div>
  );
}
