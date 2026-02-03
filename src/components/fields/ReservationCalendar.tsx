"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  addDays,
  addWeeks,
  format,
  isSameWeek,
  parseISO,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
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
}

interface Schedule {
  day: string;
  startHour: string;
  endHour: string;
}

interface ReservationCalendarProps {
  fieldId: string;
  schedules?: Schedule[];
  reservations?: Reservation[];
}

export function ReservationCalendar({
  fieldId: _fieldId,
  schedules = [],
  reservations = [],
}: ReservationCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

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

  // Mapear reservas por día y hora
  const reservationsBySlot = useMemo(() => {
    const dayEnumFromDate = (date: Date): string => {
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
    const map = new Map<string, Reservation[]>();
    reservations.forEach((reservation) => {
      try {
        const start = parseISO(reservation.startDate);
        const startTime = format(start, "HH:mm");
        const dayEnum = dayEnumFromDate(start);
        const key = `${dayEnum}-${startTime}`;
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)?.push(reservation);
      } catch (error) {
        console.error("Error parsing reservation date:", error);
      }
    });
    return map;
  }, [reservations]);

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
        <div className="flex items-center justify-between">
          <CardTitle>Reservas</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar reservas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border rounded-md w-48"
              />
            </div>
            <select className="px-3 py-1.5 text-sm border rounded-md">
              <option>Todos</option>
            </select>
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

        {/* Calendario */}
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-8 border-b bg-muted/50">
            <div className="p-2 font-medium text-sm border-r">Hora</div>
            {weekDays.map((day) => {
              const dayEnum = getDayEnum(day);
              const schedule = schedulesByDay.get(dayEnum);
              const isToday =
                format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

              return (
                <div
                  key={format(day, "yyyy-MM-dd")}
                  className={`p-2 text-center border-r last:border-r-0 ${
                    isToday ? "bg-green-50" : ""
                  }`}
                >
                  <div className="font-medium text-sm">
                    {dayLabels[dayEnum] || dayEnum} {format(day, "d")}
                  </div>
                  {schedule ? (
                    <div className="text-xs text-green-600 mt-1">
                      {schedule.startHour} - {schedule.endHour}
                    </div>
                  ) : (
                    <div className="text-xs text-red-600 mt-1">Cerrado</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="grid grid-cols-8 border-b last:border-b-0"
              >
                <div className="p-2 text-sm text-muted-foreground border-r bg-muted/30">
                  {time}
                </div>
                {weekDays.map((day) => {
                  const dayEnum = getDayEnum(day);
                  const _schedule = schedulesByDay.get(dayEnum);
                  const isAvailable = isTimeInSchedule(dayEnum, time);
                  const reservationKey = `${dayEnum}-${time}`;
                  const slotReservations =
                    reservationsBySlot.get(reservationKey) || [];

                  return (
                    <div
                      key={format(day, "yyyy-MM-dd")}
                      className={`p-1 border-r last:border-r-0 min-h-[40px] ${
                        isAvailable
                          ? "bg-white hover:bg-green-50 cursor-pointer"
                          : "bg-gray-100"
                      }`}
                    >
                      {slotReservations.map((reservation) => {
                        const start = parseISO(reservation.startDate);
                        const end = parseISO(reservation.endDate);
                        return (
                          <div
                            key={reservation.id}
                            className={`${getStatusColor(
                              reservation.status
                            )} text-white text-xs p-1 rounded mb-1`}
                            title={`${getStatusLabel(reservation.status)} - ${format(
                              start,
                              "HH:mm"
                            )}-${format(end, "HH:mm")}`}
                          >
                            {format(start, "HH:mm")} - {format(end, "HH:mm")}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Leyenda */}
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Confirmada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm">Cancelada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-sm">Fuera de horario</span>
          </div>
        </div>

        {/* Consejos */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">
                Consejos para reservar
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Haz clic en un horario disponible para crear una reserva
                </li>
                <li>
                  • Solo puedes reservar dentro de los horarios de atención
                  configurados
                </li>
                <li>• Las reservas tienen una duración máxima de 2 horas</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
