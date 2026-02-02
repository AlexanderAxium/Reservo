"use client";

import { useAuthContext } from "@/AuthContext";
import { ReservationGuestForm } from "@/components/reservation/ReservationGuestForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FeatureIcon } from "@/lib/feature-icons";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import {
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const WEEKDAY_TO_ENUM: Record<number, string> = {
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
  0: "SUNDAY",
};

const _DAY_LABELS: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const _SPORT_LABELS: Record<string, string> = {
  FOOTBALL: "Fútbol",
  TENNIS: "Tenis",
  BASKETBALL: "Básquet",
  VOLLEYBALL: "Vóley",
  FUTSAL: "Futsal",
};

function getDayEnum(date: Date): string {
  const day = date.getDay();
  return WEEKDAY_TO_ENUM[day] ?? "MONDAY";
}

export default function PublicFieldReservePage() {
  const params = useParams();
  const fieldId = params.id as string;
  const { user } = useAuthContext();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "qulqi" | "mercadopago" | "otro"
  >("qulqi");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselApiRef = useRef<{ scrollTo: (i: number) => void } | null>(null);

  const { data: field, isLoading } = trpc.field.getByIdPublic.useQuery(
    { id: fieldId },
    { enabled: !!fieldId }
  );

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const rangeStart = selectedDate
    ? new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0
      )
    : weekStart;
  const rangeEnd = selectedDate
    ? new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        23,
        59,
        59
      )
    : addDays(weekStart, 13);

  const { data: reservationsInRange } =
    trpc.field.getReservationsForRange.useQuery(
      {
        fieldId,
        startDate: rangeStart.toISOString(),
        endDate: rangeEnd.toISOString(),
      },
      { enabled: !!fieldId && !!field && (!!selectedDate || true) }
    );

  const createReservation = trpc.field.createReservation.useMutation({
    onSuccess: () => {
      toast.success("Reserva registrada correctamente");
      setReservationModalOpen(false);
      setSelectedDate(null);
      setSelectedSlots([]);
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo completar la reserva");
    },
  });

  const scheduleForSelectedDay = useMemo(() => {
    if (!field || !selectedDate) return null;
    const dayEnum = getDayEnum(selectedDate);
    return field.schedules.find((s) => s.day === dayEnum) ?? null;
  }, [field, selectedDate]);

  const timeSlotsForDay = useMemo(() => {
    if (!scheduleForSelectedDay) return [];
    const [startH, startM] = scheduleForSelectedDay.startHour
      .split(":")
      .map(Number);
    const [endH, endM] = scheduleForSelectedDay.endHour.split(":").map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    const slots: string[] = [];
    for (let m = startMin; m < endMin; m += 60) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      slots.push(
        `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
      );
    }
    return slots;
  }, [scheduleForSelectedDay]);

  const reservedSlotSet = useMemo(() => {
    const set = new Set<string>();
    if (!reservationsInRange || !selectedDate) return set;
    const base = format(selectedDate, "yyyy-MM-dd");
    reservationsInRange.forEach((r) => {
      const start =
        typeof r.startDate === "string" ? parseISO(r.startDate) : r.startDate;
      const end =
        typeof r.endDate === "string" ? parseISO(r.endDate) : r.endDate;
      const resDay = format(start, "yyyy-MM-dd");
      if (resDay !== base) return;
      const startTime = format(start, "HH:mm");
      const endTime = format(end, "HH:mm");
      for (const slot of timeSlotsForDay) {
        if (slot >= startTime && slot < endTime) set.add(`${base}-${slot}`);
      }
    });
    return set;
  }, [reservationsInRange, selectedDate, timeSlotsForDay]);

  const toggleSlot = (slot: string) => {
    if (!selectedDate) return;
    const key = `${format(selectedDate, "yyyy-MM-dd")}-${slot}`;
    if (reservedSlotSet.has(key)) return;
    setSelectedSlots((prev) => {
      if (prev.includes(slot)) {
        return prev.filter((s) => s !== slot);
      }
      const next = [...prev, slot].sort();
      if (next.length > 2) return prev;
      const _idx = timeSlotsForDay.indexOf(slot);
      const isConsecutive =
        next.length === 1 ||
        (next.length === 2 &&
          Math.abs(
            timeSlotsForDay.indexOf(next[1]) - timeSlotsForDay.indexOf(next[0])
          ) === 1);
      if (!isConsecutive) return prev;
      return next;
    });
  };

  const totalHours = selectedSlots.length;
  const totalAmount =
    field && totalHours > 0 ? Number(field.price) * totalHours : 0;
  const SERVICE_CHARGE = 2;
  const totalWithService = totalAmount + SERVICE_CHARGE;
  const canComplete = selectedDate && selectedSlots.length > 0;

  const handleCompleteReservation = () => {
    if (!canComplete || !field || !selectedDate) return;
    setReservationModalOpen(true);
  };

  const confirmReservationAsUser = () => {
    if (!canComplete || !field || !selectedDate) return;
    const startDate = new Date(selectedDate);
    const [h, m] = selectedSlots[0].split(":").map(Number);
    startDate.setHours(h, m, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + totalHours, 0, 0, 0);
    createReservation.mutate({
      fieldId: field.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      amount: totalAmount,
    });
  };

  const submitGuestReservation = (guest: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
  }) => {
    if (!canComplete || !field || !selectedDate) return;
    const startDate = new Date(selectedDate);
    const [h, m] = selectedSlots[0].split(":").map(Number);
    startDate.setHours(h, m, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + totalHours, 0, 0, 0);
    createReservation.mutate({
      fieldId: field.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      amount: totalAmount,
      guestName: guest.guestName,
      guestEmail: guest.guestEmail,
      guestPhone: guest.guestPhone,
    });
  };

  if (isLoading || !field) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto py-12">
          {isLoading ? (
            <p className="text-center text-muted-foreground">
              Cargando cancha...
            </p>
          ) : (
            <p className="text-center text-muted-foreground">
              Cancha no encontrada
            </p>
          )}
        </div>
      </div>
    );
  }

  const images = field.images?.length
    ? field.images
    : ["https://images.unsplash.com/photo-1575361204480-05e88e6e8b1f?w=800"];

  const nightPrice = Number(field.price) * 1.25;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-teal-600 transition-colors">
            Inicio
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-1" />
          <Link
            href="/canchas"
            className="hover:text-teal-600 transition-colors"
          >
            Canchas
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-1" />
          <span className="text-foreground">{field.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información de la cancha */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Información de la cancha
            </h2>
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <Carousel
                className="w-full"
                setApi={(api) => {
                  if (!api) return;
                  carouselApiRef.current = api;
                  api.on("select", () =>
                    setCarouselIndex(api.selectedScrollSnap())
                  );
                }}
              >
                <CarouselContent>
                  {images.map((url, i) => (
                    <CarouselItem key={url}>
                      <div className="aspect-video relative bg-muted">
                        <img
                          src={url}
                          alt={`${field.name} ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 right-3 rounded bg-card/90 px-2 py-1 text-xs font-medium text-foreground shadow border border-border">
                          {i + 1}/{images.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 border-border bg-card/90 text-foreground hover:bg-card" />
                <CarouselNext className="right-2 border-border bg-card/90 text-foreground hover:bg-card" />
              </Carousel>
              <div className="p-4 flex gap-2 overflow-x-auto border-t border-border">
                {images.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => {
                      setCarouselIndex(i);
                      carouselApiRef.current?.scrollTo(i);
                    }}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                      carouselIndex === i
                        ? "border-teal-500 ring-1 ring-teal-500"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            {field.description && (
              <p className="mt-4 text-muted-foreground">{field.description}</p>
            )}
          </div>

          {/* Precios: regular y nocturno */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Precio regular</p>
                <p className="text-xl font-bold text-foreground">
                  S/ {formatPrice(field.price)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Precio nocturno</p>
                <p className="text-xl font-bold text-foreground">
                  S/ {formatPrice(nightPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Características de la cancha */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">
              Características de la cancha
            </h3>
            <div className="flex flex-wrap gap-2">
              {field.fieldFeatures && field.fieldFeatures.length > 0 ? (
                field.fieldFeatures.map((ff) => (
                  <span
                    key={ff.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground"
                  >
                    <FeatureIcon
                      iconName={ff.feature?.icon}
                      className="h-4 w-4 text-muted-foreground"
                      size={16}
                    />
                    {ff.feature?.name ?? ""}
                    {ff.value ? ` (${ff.value})` : ""}
                  </span>
                ))
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground">
                    Iluminación
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground">
                    Duchas
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground">
                    Estacionamiento
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Horarios disponibles */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                Horarios disponibles
              </h3>
              <Link
                href="/canchas"
                className="text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                Ver todos →
              </Link>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {weekDays.map((day) => {
                  const isSelected =
                    selectedDate &&
                    format(day, "yyyy-MM-dd") ===
                      format(selectedDate, "yyyy-MM-dd");
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedSlots([]);
                      }}
                      className={`flex-shrink-0 rounded-xl border-2 px-4 py-3 text-left transition-colors bg-card ${
                        isSelected
                          ? "border-teal-500 text-teal-600 shadow-sm"
                          : "border-border text-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      <p className="font-medium text-sm capitalize">
                        {format(day, "EEEE", { locale: es })}
                      </p>
                      <p
                        className={`text-lg font-semibold ${
                          isSelected ? "text-teal-600" : "text-foreground"
                        }`}
                      >
                        {format(day, "d", { locale: es })}{" "}
                        <span className="text-sm font-normal lowercase">
                          {format(day, "MMM", { locale: es })}
                        </span>
                      </p>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <>
                  <p className="font-semibold text-foreground">
                    Selecciona hasta 2 horas consecutivas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {timeSlotsForDay.map((slot) => {
                      const key = `${format(selectedDate, "yyyy-MM-dd")}-${slot}`;
                      const isReserved = reservedSlotSet.has(key);
                      const isSelected = selectedSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isReserved}
                          onClick={() => toggleSlot(slot)}
                          className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                            isReserved
                              ? "bg-muted text-muted-foreground cursor-not-allowed border-border"
                              : isSelected
                                ? "border-teal-500 bg-teal-600 text-white"
                                : "border-border bg-card text-foreground hover:bg-muted"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  {timeSlotsForDay.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No hay horarios configurados para este día
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold">
                      i
                    </span>
                    Puedes seleccionar hasta 2 horas consecutivas
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha - Reserva */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 rounded-xl border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-teal-600 text-white rounded-t-xl">
              <CardTitle>Reserva esta cancha</CardTitle>
              <CardDescription className="text-white/90">
                Disponible para reservar ahora
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 gap-2 rounded-lg bg-muted border border-border p-3">
                <div className="flex justify-between text-sm text-foreground">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Fecha seleccionada
                  </span>
                  <span>
                    {selectedDate
                      ? format(selectedDate, "EEEE, d 'de' MMMM", {
                          locale: es,
                        })
                      : "No seleccionada"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Horas seleccionadas
                  </span>
                  <span>
                    {selectedSlots.length > 0
                      ? `${selectedSlots[0]}${selectedSlots[1] ? ` - ${selectedSlots[1]}` : ""} (${totalHours}h)`
                      : "No seleccionadas"}
                  </span>
                </div>
              </div>

              {field.sportCenter && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Building2 className="h-4 w-4" />
                    Centro deportivo
                  </p>
                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1 text-foreground">
                    <p>
                      <span className="text-muted-foreground">Nombre: </span>
                      {field.sportCenter.name}
                    </p>
                    {field.sportCenter.district && (
                      <p>
                        <span className="text-muted-foreground">
                          Distrito:{" "}
                        </span>
                        {field.sportCenter.district}
                      </p>
                    )}
                    {field.sportCenter._count?.fields != null && (
                      <p className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {field.sportCenter._count.fields} canchas
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedSlots.length > 0 && (
                <div className="space-y-1 text-sm">
                  <p>
                    {selectedSlots[0]}
                    {selectedSlots[1] ? ` - ${selectedSlots[1]}` : ""} S/{" "}
                    {formatPrice(totalAmount)}
                  </p>
                  <p className="font-semibold">
                    Total: S/ {formatPrice(totalAmount)}
                  </p>
                </div>
              )}

              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                size="lg"
                disabled={!canComplete || createReservation.isPending}
                onClick={handleCompleteReservation}
              >
                {createReservation.isPending
                  ? "Procesando..."
                  : "Completar reserva"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Al reservar, aceptas los términos y condiciones
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Completar Reserva (diseño mockup: resumen, detalles pago, método pago solo selección) */}
      <Dialog
        open={reservationModalOpen}
        onOpenChange={setReservationModalOpen}
      >
        <DialogContent className="bg-card border-border text-foreground max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">
              Completar Reserva
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Confirma los detalles de tu reserva y realiza el pago.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Resumen de la Reserva */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Resumen de la Reserva
              </h3>
              <div className="rounded-xl border border-border bg-muted/30 dark:bg-muted/20 p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-0.5">Cancha</p>
                  <p className="font-medium text-foreground">{field.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">
                    Centro Deportivo
                  </p>
                  <p className="font-medium text-foreground">
                    {field.sportCenter?.name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Fecha</p>
                  <p className="font-medium text-foreground">
                    {selectedDate
                      ? format(selectedDate, "EEEE, d 'de' MMMM yyyy", {
                          locale: es,
                        })
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Hora</p>
                  <p className="font-medium text-foreground">
                    {selectedSlots[0]}
                    {selectedSlots[1] ? ` - ${selectedSlots[1]}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Datos invitado o Detalles del Pago (placeholder) */}
            {!user ? (
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Datos de contacto
                </h3>
                <ReservationGuestForm
                  onSubmit={submitGuestReservation}
                  onCancel={() => setReservationModalOpen(false)}
                  isLoading={createReservation.isPending}
                />
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Detalles del Pago
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  (Solo visualización por ahora; el pago no está implementado.)
                </p>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="res-card-name"
                      className="text-sm text-muted-foreground block mb-1"
                    >
                      Nombre en la Tarjeta
                    </label>
                    <input
                      id="res-card-name"
                      type="text"
                      placeholder="Juan Pérez"
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/50 dark:bg-gray-800 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="res-card-number"
                      className="text-sm text-muted-foreground block mb-1"
                    >
                      Número de Tarjeta
                    </label>
                    <input
                      id="res-card-number"
                      type="text"
                      placeholder="4111 1111 1111 1111"
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/50 dark:bg-gray-800 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="res-card-expiry"
                        className="text-sm text-muted-foreground block mb-1"
                      >
                        Fecha de Vencimiento
                      </label>
                      <input
                        id="res-card-expiry"
                        type="text"
                        placeholder="MM/AA"
                        readOnly
                        className="w-full rounded-lg border border-border bg-muted/50 dark:bg-gray-800 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="res-card-cvv"
                        className="text-sm text-muted-foreground block mb-1"
                      >
                        CVV
                      </label>
                      <input
                        id="res-card-cvv"
                        type="text"
                        placeholder="123"
                        readOnly
                        className="w-full rounded-lg border border-border bg-muted/50 dark:bg-gray-800 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Método de Pago (solo selección) */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Método de Pago
              </h3>
              <div className="flex gap-3 flex-wrap">
                {(
                  [
                    { id: "qulqi" as const, label: "Qulqi", icon: CreditCard },
                    {
                      id: "mercadopago" as const,
                      label: "Mercado Pago",
                      icon: Wallet,
                    },
                    { id: "otro" as const, label: "Otro", icon: DollarSign },
                  ] as const
                ).map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-4 py-3 min-w-[100px] transition-colors ${
                      selectedPaymentMethod === method.id
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-border bg-muted/30 dark:bg-gray-800/50 text-foreground hover:border-muted-foreground/50"
                    }`}
                  >
                    <method.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resumen de cargos y Total */}
            <div className="rounded-xl border border-border bg-muted/20 dark:bg-muted/10 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-foreground">
                <span>
                  Alquiler de Cancha ({selectedSlots[0]}
                  {selectedSlots[1] ? ` - ${selectedSlots[1]}` : ""})
                </span>
                <span>S/ {formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Cargo por Servicio</span>
                <span>S/ {formatPrice(SERVICE_CHARGE)}</span>
              </div>
              <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  S/ {formatPrice(totalWithService)}
                </span>
              </div>
            </div>

            {/* Confirmar: usuario envía reserva; invitado ya envió con el form */}
            {user ? (
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReservationModalOpen(false)}
                  disabled={createReservation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmReservationAsUser}
                  disabled={createReservation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {createReservation.isPending
                    ? "Procesando..."
                    : "Confirmar Reserva"}
                </Button>
              </div>
            ) : null}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            Al confirmar tu reserva, aceptas nuestros Términos de Servicio y
            Política de Cancelación.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
