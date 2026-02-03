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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const weekDays = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

// Generar intervalos de 30 minutos
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (day: string, startHour: string, endHour: string) => void;
  initialDay?: string;
  initialStartHour?: string;
  initialEndHour?: string;
  mode?: "create" | "edit";
  scheduleId?: string;
}

export function ScheduleModal({
  open,
  onOpenChange,
  onSave,
  initialDay,
  initialStartHour,
  initialEndHour,
  mode = "create",
}: ScheduleModalProps) {
  const [day, setDay] = useState<string>(initialDay || "");
  const [startHour, setStartHour] = useState<string>(initialStartHour || "");
  const [endHour, setEndHour] = useState<string>(initialEndHour || "");

  // Convierte "HH:mm" a minutos totales desde las 00:00.
  // Si el formato no es válido, devuelve 0 para evitar NaN.
  const getMinutesFromTime = (time: string): number => {
    const [hStr, mStr] = time.split(":");
    const hours = Number.parseInt(hStr ?? "0", 10);
    const minutes = Number.parseInt(mStr ?? "0", 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (open) {
      setDay(initialDay || "");
      setStartHour(initialStartHour || "");
      setEndHour(initialEndHour || "");
    } else {
      // Reset cuando se cierra
      setDay("");
      setStartHour("");
      setEndHour("");
    }
  }, [open, initialDay, initialStartHour, initialEndHour]);

  const handleSave = () => {
    if (!day || !startHour || !endHour) {
      return;
    }

    // Validar que la hora de cierre sea mayor que la de apertura
    const startMinutes = getMinutesFromTime(startHour);
    const endMinutes = getMinutesFromTime(endHour);

    if (endMinutes <= startMinutes) {
      alert("La hora de cierre debe ser mayor que la hora de apertura");
      return;
    }

    onSave(day, startHour, endHour);
    onOpenChange(false);
    // Reset form
    setDay("");
    setStartHour("");
    setEndHour("");
  };

  // Filtrar horas de cierre que sean mayores que la de apertura
  const availableEndHours = startHour
    ? timeSlots.filter((time) => {
        const startMinutes = getMinutesFromTime(startHour);
        const endMinutes = getMinutesFromTime(time);
        return endMinutes > startMinutes;
      })
    : timeSlots;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* DialogContent ya incluye botón X (close) por defecto */}
      <DialogContent className="sm:max-w-[425px]" showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar Horario" : "Añadir Horario"}
          </DialogTitle>
          <DialogDescription>
            Configura los horarios disponibles para cada día de la semana
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="schedule-day">
              Día de la semana <span className="text-destructive">*</span>
            </label>
            <Select
              value={day}
              onValueChange={setDay}
              disabled={mode === "edit"}
            >
              <SelectTrigger id="schedule-day">
                <SelectValue placeholder="Seleccionar día" />
              </SelectTrigger>
              <SelectContent>
                {weekDays.map((weekDay) => (
                  <SelectItem key={weekDay.value} value={weekDay.value}>
                    {weekDay.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="schedule-start">
              Hora de apertura <span className="text-destructive">*</span>
            </label>
            <Select value={startHour} onValueChange={setStartHour}>
              <SelectTrigger id="schedule-start">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="schedule-end">
              Hora de cierre <span className="text-destructive">*</span>
            </label>
            <Select
              value={endHour}
              onValueChange={setEndHour}
              disabled={!startHour}
            >
              <SelectTrigger id="schedule-end">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {availableEndHours.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!day || !startHour || !endHour}
          >
            {mode === "edit" ? "Guardar" : "Añadir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
