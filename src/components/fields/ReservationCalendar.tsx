"use client";

import {
  type FieldOption,
  ManualReservationModal,
} from "@/components/reservation/ManualReservationModal";
import { ReservationDetailModal } from "@/components/reservation/ReservationDetailModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addDays,
  addWeeks,
  format,
  isSameWeek,
  parseISO,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

const dayLabels: Record<string, string> = {
  MONDAY: "LUN",
  TUESDAY: "MAR",
  WEDNESDAY: "MIÉ",
  THURSDAY: "JUE",
  FRIDAY: "VIE",
  SATURDAY: "SÁB",
  SUNDAY: "DOM",
};

// Generar intervalos de 30 minutos
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 7; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  amount: number;
  /** Nombre del cliente (usuario o invitado) para el preview en la celda */
  clientName?: string;
}

interface Schedule {
  day: string;
  startHour: string;
  endHour: string;
}

interface ReservationCalendarProps {
  fieldId: string;
  fieldName?: string;
  fieldPrice?: number;
  schedules?: Schedule[];
  reservations?: Reservation[];
  /** Ruta base para enlaces al detalle del campo (owner o admin) */
  fieldHref: (fieldId: string) => string;
}

export function ReservationCalendar({
  fieldId,
  fieldName,
  fieldPrice,
  schedules = [],
  reservations = [],
  fieldHref,
}: ReservationCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Lunes
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, -1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  // Obtener el día de la semana en formato del enum
  const getDayEnum = (date: Date): string => {
    const day = format(date, "EEEE", { locale: es }).toUpperCase();
    const dayMap: Record<string, string> = {
      LUNES: "MONDAY",
      MARTES: "TUESDAY",
      MIÉRCOLES: "WEDNESDAY",
      JUEVES: "THURSDAY",
      VIERNES: "FRIDAY",
      SÁBADO: "SATURDAY",
      DOMINGO: "SUNDAY",
    };
    return dayMap[day] || day;
  };

  // Mapear horarios por día
  const schedulesByDay = useMemo(() => {
    const map = new Map<string, Schedule>();
    schedules.forEach((schedule) => {
      map.set(schedule.day, schedule);
    });
    return map;
  }, [schedules]);

  // Filtrar reservas por búsqueda y estado
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.clientName?.toLowerCase().includes(q);
        const matchesId = r.id.toLowerCase().includes(q);
        if (!matchesName && !matchesId) return false;
      }
      return true;
    });
  }, [reservations, searchQuery, statusFilter]);

  // Mapear reservas por fecha exacta y hora
  const reservationsBySlot = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    filteredReservations.forEach((reservation) => {
      try {
        const start = parseISO(reservation.startDate);
        // Usar fecha exacta (yyyy-MM-dd) como clave en vez de solo el día de la semana
        const dateKey = format(start, "yyyy-MM-dd");
        const startTime = format(start, "HH:mm");
        const key = `${dateKey}-${startTime}`;
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)?.push(reservation);
      } catch (error) {
        console.error("Error parsing reservation date:", error);
      }
    });
    return map;
  }, [filteredReservations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      case "COMPLETED":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmada";
      case "PENDING":
        return "Pendiente";
      case "CANCELLED":
        return "Cancelada";
      case "COMPLETED":
        return "Completada";
      default:
        return "Desconocido";
    }
  };

  const isTimeInSchedule = (dayEnum: string, time: string): boolean => {
    const schedule = schedulesByDay.get(dayEnum);
    if (!schedule) return false;

    const parse = (value: string): number => {
      const [hStr, mStr] = value.split(":");
      const h = Number.parseInt(hStr ?? "0", 10);
      const m = Number.parseInt(mStr ?? "0", 10);
      if (Number.isNaN(h) || Number.isNaN(m)) return 0;
      return h * 60 + m;
    };

    const timeMinutes = parse(time);
    const startMinutes = parse(schedule.startHour);
    const endMinutes = parse(schedule.endHour);

    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
  };

  const isCurrentWeek = isSameWeek(currentWeek, new Date(), {
    weekStartsOn: 1,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle>Reservas</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar reservas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-48 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                <SelectItem value="COMPLETED">Completada</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setManualModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Nueva reserva
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Navegación de semana */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              Semana del {format(weekStart, "dd/MM/yyyy")} al{" "}
              {format(addDays(weekStart, 6), "dd/MM/yyyy")}
            </span>
            {!isCurrentWeek && (
              <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
                <Calendar className="mr-2 h-4 w-4" />
                Ir a semana actual
              </Button>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendario: columna Hora fija + 7 días con ancho mínimo para que el texto de reservas no se corte */}
        <div className="border border-border rounded-lg overflow-x-auto">
          <div
            className="grid border-b border-border bg-muted/40 dark:bg-muted/30 min-w-[640px]"
            style={{
              gridTemplateColumns:
                "minmax(3.5rem, auto) repeat(7, minmax(6rem, 1fr))",
            }}
          >
            <div className="p-2 font-medium text-sm text-foreground border-r border-border">
              Hora
            </div>
            {weekDays.map((day) => {
              const dayEnum = getDayEnum(day);
              const schedule = schedulesByDay.get(dayEnum);
              const isToday =
                format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

              return (
                <div
                  key={format(day, "yyyy-MM-dd")}
                  className={`p-2 text-center border-r border-border last:border-r-0 ${
                    isToday
                      ? "bg-slate-200/70 dark:bg-slate-600/50"
                      : "bg-transparent"
                  }`}
                >
                  <div className="font-medium text-sm text-foreground">
                    {dayLabels[dayEnum] || dayEnum} {format(day, "d")}
                  </div>
                  {schedule ? (
                    <div className="text-xs text-muted-foreground mt-1">
                      {schedule.startHour} - {schedule.endHour}
                    </div>
                  ) : (
                    <div className="text-xs text-destructive mt-1">Cerrado</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="max-h-[600px] overflow-y-auto min-w-[640px]">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="grid border-b border-border last:border-b-0 min-h-[44px]"
                style={{
                  gridTemplateColumns:
                    "minmax(3.5rem, auto) repeat(7, minmax(6rem, 1fr))",
                }}
              >
                <div className="flex min-h-[44px] items-center p-2 text-sm text-muted-foreground border-r border-border bg-muted/20 dark:bg-muted/10 shrink-0">
                  {time}
                </div>
                {weekDays.map((day) => {
                  const dayEnum = getDayEnum(day);
                  const dateKey = format(day, "yyyy-MM-dd");
                  const isAvailable = isTimeInSchedule(dayEnum, time);
                  const reservationKey = `${dateKey}-${time}`;
                  const slotReservations =
                    reservationsBySlot.get(reservationKey) || [];

                  return (
                    <div
                      key={format(day, "yyyy-MM-dd")}
                      className={`flex min-h-[44px] min-w-0 flex-col justify-start p-1 border-r border-border last:border-r-0 ${
                        isAvailable
                          ? "bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                          : "bg-muted/30 dark:bg-muted/20"
                      }`}
                    >
                      {slotReservations.map((reservation) => {
                        const start = parseISO(reservation.startDate);
                        const end = parseISO(reservation.endDate);
                        const label = reservation.clientName
                          ? `${reservation.clientName} · ${format(start, "HH:mm")}-${format(end, "HH:mm")}`
                          : `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
                        const namePart = reservation.clientName
                          ? `${reservation.clientName.slice(0, 20)}${reservation.clientName.length > 20 ? "…" : ""}`
                          : null;
                        const shortLabel = namePart
                          ? `${namePart} ${format(start, "HH:mm")}`
                          : `${format(start, "HH:mm")}-${format(end, "HH:mm")}`;
                        return (
                          <button
                            type="button"
                            key={reservation.id}
                            onClick={() =>
                              setSelectedReservationId(reservation.id)
                            }
                            className={`min-w-0 w-full text-left ${getStatusColor(
                              reservation.status
                            )} text-white text-xs p-1.5 rounded mb-1 hover:opacity-90 transition-opacity overflow-hidden`}
                            title={label}
                          >
                            <span className="block truncate font-medium">
                              {shortLabel}
                            </span>
                            <span className="block truncate opacity-90 text-[10px]">
                              {getStatusLabel(reservation.status)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <ReservationDetailModal
          reservationId={selectedReservationId}
          onClose={() => setSelectedReservationId(null)}
          fieldHref={fieldHref}
          onStatusUpdated={() => setSelectedReservationId(null)}
        />

        {fieldId && (
          <ManualReservationModal
            open={manualModalOpen}
            onOpenChange={setManualModalOpen}
            fields={
              fieldName
                ? [
                    {
                      id: fieldId,
                      name: fieldName,
                      price: fieldPrice ?? 0,
                    } satisfies FieldOption,
                  ]
                : []
            }
          />
        )}

        {/* Leyenda */}
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <Badge
            variant="outline"
            className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
            Confirmada
          </Badge>
          <Badge
            variant="outline"
            className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
          >
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5" />
            Pendiente
          </Badge>
          <Badge
            variant="outline"
            className="border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
            Cancelada
          </Badge>
          <Badge
            variant="outline"
            className="border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
            Completada
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
