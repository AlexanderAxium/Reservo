"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { FeatureIcon } from "@/lib/feature-icons";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { addDays, format, parseISO, startOfDay } from "date-fns";
import type { Locale } from "date-fns";
import { enUS } from "date-fns/locale";
import { es } from "date-fns/locale";
import { ptBR } from "date-fns/locale";
import {
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

const WEEKDAY_TO_ENUM: Record<number, string> = {
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
  0: "SUNDAY",
};

const DATE_LOCALES: Record<string, Locale> = {
  es,
  en: enUS,
  pt: ptBR,
};

function getDayEnum(date: Date): string {
  const day = date.getDay();
  return WEEKDAY_TO_ENUM[day] ?? "MONDAY";
}

export default function PublicFieldReservePage() {
  const { t } = useTranslation("fields");
  const { t: tCommon } = useTranslation("common");
  const { locale } = useTranslation("common");
  const dateLocale = DATE_LOCALES[locale] ?? es;

  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselApiRef = useRef<{ scrollTo: (i: number) => void } | null>(null);

  const { data: field, isLoading } = trpc.field.getBySlugPublic.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const todayStart = startOfDay(new Date());
  const weekDays = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(todayStart, i)),
    [todayStart]
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
    : todayStart;
  const rangeEnd = selectedDate
    ? new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        23,
        59,
        59
      )
    : addDays(todayStart, 13);

  const { data: reservationsInRange } =
    trpc.field.getReservationsForRange.useQuery(
      {
        fieldId: field?.id ?? "",
        startDate: rangeStart.toISOString(),
        endDate: rangeEnd.toISOString(),
      },
      { enabled: !!field?.id && (!!selectedDate || true) }
    );

  const scheduleForSelectedDay = useMemo(() => {
    if (!field || !selectedDate) return null;
    const dayEnum = getDayEnum(selectedDate);
    return field.schedules.find((s) => s.day === dayEnum) ?? null;
  }, [field, selectedDate]);

  const timeSlotsForDay = useMemo(() => {
    if (!scheduleForSelectedDay) return [];
    const [startH = 0, startM = 0] = scheduleForSelectedDay.startHour
      .split(":")
      .map(Number);
    const [endH = 0, endM = 0] = scheduleForSelectedDay.endHour
      .split(":")
      .map(Number);
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
      const idx0 = next[0] ? timeSlotsForDay.indexOf(next[0]) : -1;
      const idx1 = next[1] ? timeSlotsForDay.indexOf(next[1]) : -1;
      const isConsecutive =
        next.length === 1 ||
        (next.length === 2 &&
          idx0 !== -1 &&
          idx1 !== -1 &&
          Math.abs(idx1 - idx0) === 1);
      if (!isConsecutive) return prev;
      return next;
    });
  };

  const totalHours = selectedSlots.length;
  const totalAmount =
    field && totalHours > 0 ? Number(field.price) * totalHours : 0;
  const canComplete = selectedDate && selectedSlots.length > 0;

  const handleGoToCheckout = () => {
    if (!canComplete || !field || !selectedDate) return;
    const dateParam = format(selectedDate, "yyyy-MM-dd");
    const slotsParam = selectedSlots.join(",");
    router.push(
      `/canchas/${slug}/checkout?date=${dateParam}&slots=${slotsParam}`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
            <Skeleton className="h-40 rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto py-12">
          <p className="text-center text-foreground/80">{t("fieldNotFound")}</p>
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
        <div className="container mx-auto px-4 py-3 text-sm text-foreground/80">
          <Link href="/" className="hover:text-teal-600 transition-colors">
            {tCommon("home")}
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-1" />
          <Link
            href="/canchas"
            className="hover:text-teal-600 transition-colors"
          >
            {tCommon("fields")}
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
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {field.name}
            </h1>
            {field.sportCenter && (
              <div className="flex items-start gap-2 text-muted-foreground mb-4">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">
                    {field.sportCenter.name}
                  </p>
                  {field.sportCenter.address && (
                    <p className="text-sm">{field.sportCenter.address}</p>
                  )}
                  {field.sportCenter.district && (
                    <p className="text-sm">{field.sportCenter.district}</p>
                  )}
                  {field.googleMapsUrl && (
                    <a
                      href={field.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <MapPin className="h-4 w-4" /> Ver en Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}
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
                <p className="text-sm text-foreground/70">{t("nightPrice")}</p>
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
                    {t("lighting")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground">
                    {t("showers")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground">
                    {t("parking")}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Horarios disponibles */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {t("availableSchedules")}
              </h3>
              <Link
                href="/canchas"
                className="text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                {t("viewAll")} →
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
                        {format(day, "EEEE", { locale: dateLocale })}
                      </p>
                      <p
                        className={`text-lg font-semibold ${
                          isSelected ? "text-teal-600" : "text-foreground"
                        }`}
                      >
                        {format(day, "d", { locale: dateLocale })}{" "}
                        <span className="text-sm font-normal lowercase">
                          {format(day, "MMM", { locale: dateLocale })}
                        </span>
                      </p>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <>
                  <p className="font-semibold text-foreground">
                    {t("selectUpTo2Hours")}
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
                    <p className="text-sm text-foreground/70">
                      {t("noSchedulesForDay")}
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-sm text-foreground/70">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-foreground/70 text-xs font-bold">
                      i
                    </span>
                    {t("selectUpTo2HoursTip")}
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
              <CardTitle>{t("reserveThisCourt")}</CardTitle>
              <CardDescription className="text-white/90">
                {t("availableToReserve")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 gap-2 rounded-lg bg-muted border border-border p-3">
                <div className="flex justify-between text-sm text-foreground">
                  <span className="text-foreground/70 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {t("selectedDate")}
                  </span>
                  <span>
                    {selectedDate
                      ? format(
                          selectedDate,
                          locale === "en"
                            ? "EEEE, MMMM d"
                            : "EEEE, d 'de' MMMM",
                          {
                            locale: dateLocale,
                          }
                        )
                      : t("notSelected")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {t("selectedHours")}
                  </span>
                  <span>
                    {selectedSlots.length > 0
                      ? `${selectedSlots[0] ?? ""}${selectedSlots[1] ? ` - ${selectedSlots[1]}` : ""} (${totalHours}h)`
                      : t("notSelectedPlural")}
                  </span>
                </div>
              </div>

              {field.sportCenter && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Building2 className="h-4 w-4" />
                    {t("sportCenter")}
                  </p>
                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1 text-foreground">
                    <p>
                      <span className="text-foreground/70">{t("name")}: </span>
                      {field.sportCenter.name}
                    </p>
                    {field.sportCenter.district && (
                      <p>
                        <span className="text-foreground/70">
                          {t("district")}:{" "}
                        </span>
                        {field.sportCenter.district}
                      </p>
                    )}
                    {field.sportCenter._count?.fields != null && (
                      <p className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-foreground/70" />
                        {t("fieldsCount", {
                          count: String(field.sportCenter._count.fields),
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedSlots.length > 0 && (
                <div className="space-y-1 text-sm">
                  <p>
                    {selectedSlots[0] ?? ""}
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
                disabled={!canComplete}
                onClick={handleGoToCheckout}
              >
                {t("completeReservation")}
              </Button>
              <p className="text-xs text-foreground/70 text-center">
                {t("termsNote")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky mobile bottom bar */}
      {canComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 lg:hidden z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">
                S/ {formatPrice(totalAmount)}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalHours}h seleccionadas
              </p>
            </div>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleGoToCheckout}
            >
              {t("reserve")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
