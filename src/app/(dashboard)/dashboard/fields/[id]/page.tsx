"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ReservationCalendar } from "@/components/fields/ReservationCalendar";
import { ScheduleModal } from "@/components/fields/ScheduleModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { FeatureIcon } from "@/lib/feature-icons";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import {
  ArrowLeft,
  Clock,
  Copy,
  Edit,
  Info,
  MapPin,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const dayOrder = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const dayKeyMap: Record<string, string> = {
  MONDAY: "days.monday",
  TUESDAY: "days.tuesday",
  WEDNESDAY: "days.wednesday",
  THURSDAY: "days.thursday",
  FRIDAY: "days.friday",
  SATURDAY: "days.saturday",
  SUNDAY: "days.sunday",
};

type ScheduleItem = {
  id: string;
  day: string;
  startHour: string;
  endHour: string;
  fieldId: string;
};

export default function OwnerFieldDetailPage() {
  const params = useParams();
  const _router = useRouter();
  const { t } = useTranslation("dashboard");
  const fieldId = params.id as string;

  const {
    data: field,
    isLoading,
    refetch,
  } = trpc.field.getById.useQuery({ id: fieldId }, { enabled: !!fieldId });

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<{
    id?: string;
    day?: string;
    startHour?: string;
    endHour?: string;
  } | null>(null);
  const [deleteScheduleId, setDeleteScheduleId] = useState<string | null>(null);

  const createSchedule = trpc.field.createSchedule.useMutation({
    onSuccess: () => {
      toast.success(t("fieldDetail.scheduleCreated"));
      refetch();
      setScheduleModalOpen(false);
      setEditingSchedule(null);
    },
    onError: (error) => {
      toast.error(error.message || t("fieldDetail.scheduleCreateError"));
    },
  });

  const updateSchedule = trpc.field.updateSchedule.useMutation({
    onSuccess: () => {
      toast.success(t("fieldDetail.scheduleUpdated"));
      refetch();
      setScheduleModalOpen(false);
      setEditingSchedule(null);
    },
    onError: (error) => {
      toast.error(error.message || t("fieldDetail.scheduleUpdateError"));
    },
  });

  const deleteSchedule = trpc.field.deleteSchedule.useMutation({
    onSuccess: () => {
      toast.success(t("fieldDetail.scheduleDeleted"));
      refetch();
      setDeleteScheduleId(null);
    },
    onError: (error) => {
      toast.error(error.message || t("fieldDetail.scheduleDeleteError"));
    },
  });

  const handleSaveSchedule = (
    day: string,
    startHour: string,
    endHour: string
  ) => {
    if (editingSchedule?.id) {
      updateSchedule.mutate({
        scheduleId: editingSchedule.id,
        startHour,
        endHour,
      });
    } else {
      createSchedule.mutate({
        fieldId: fieldId,
        day: day as
          | "MONDAY"
          | "TUESDAY"
          | "WEDNESDAY"
          | "THURSDAY"
          | "FRIDAY"
          | "SATURDAY"
          | "SUNDAY",
        startHour,
        endHour,
      });
    }
  };

  const handleEditSchedule = (schedule: {
    id: string;
    day: string;
    startHour: string;
    endHour: string;
  }) => {
    setEditingSchedule({
      id: schedule.id,
      day: schedule.day,
      startHour: schedule.startHour,
      endHour: schedule.endHour,
    });
    setScheduleModalOpen(true);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    deleteSchedule.mutate({ scheduleId });
  };

  // Crear mapa de horarios por día
  const schedulesByDay = useMemo(() => {
    const map = new Map<string, ScheduleItem>();
    if (!field?.schedules) return map;
    for (const schedule of field.schedules) {
      map.set(schedule.day, schedule as ScheduleItem);
    }
    return map;
  }, [field?.schedules]);

  // Imagen por defecto
  const defaultImageUrl =
    "https://images.unsplash.com/photo-1575361204480-05e88e6e8b1f?w=800";

  // Calcular estadísticas
  const statistics = useMemo(() => {
    if (!field?.reservations) {
      return {
        totalReservations: 0,
        totalRevenue: 0,
        occupancy: 0,
      };
    }

    const effectiveReservations = field.reservations.filter(
      (r) => r.status !== "CANCELLED" && r.status !== "NO_SHOW"
    );

    const totalReservations = effectiveReservations.length;
    const totalRevenue = effectiveReservations.reduce((sum, reservation) => {
      const paidAmount =
        reservation.payments?.reduce((paymentSum, payment) => {
          if (payment.status === "PAID") {
            return paymentSum + Number(payment.amount || 0);
          }
          return paymentSum;
        }, 0) || 0;
      return (
        sum + (paidAmount > 0 ? paidAmount : Number(reservation.amount || 0))
      );
    }, 0);

    const occupancy =
      field.schedules && field.schedules.length > 0
        ? Math.min(100, Math.round((totalReservations / 10) * 100))
        : 0;

    return {
      totalReservations,
      totalRevenue,
      occupancy,
    };
  }, [field]);

  const calculateHours = (startHour: string, endHour: string): number => {
    const [startH = 0, startM = 0] = startHour.split(":").map(Number);
    const [endH = 0, endM = 0] = endHour.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return (endMinutes - startMinutes) / 60;
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[400px]">
          <p>{t("fieldForm.loadingField")}</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!field) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {t("fieldForm.fieldNotFound")}
            </p>
            <Link href="/dashboard/fields">
              <Button variant="outline">{t("fieldForm.backToList")}</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <PageHeader
          title={field.name}
          backHref="/dashboard/fields"
          actions={
            <>
              <Button variant="outline" size="sm">
                <Clock className="size-4" />
                {t("fieldDetail.configureSchedules")}
              </Button>
              <Button size="sm">
                <Plus className="size-4" />
                {t("fieldDetail.newReservation")}
              </Button>
            </>
          }
        />

        {/* Información Principal de la Cancha */}
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Imagen */}
            <div className="relative w-full md:w-64 h-48 md:h-auto">
              <img
                src={
                  field.images && field.images.length > 0
                    ? field.images[0]
                    : defaultImageUrl
                }
                alt={field.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultImageUrl;
                }}
              />
              <Badge variant="outline" className="absolute top-2 right-2">
                {t(`sports.${field.sport}`)}
              </Badge>
            </div>

            {/* Información */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{field.name}</h1>
                  {field.sportCenter && (
                    <p className="text-muted-foreground">
                      {field.sportCenter.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {field.address}
                    {field.district && `, ${field.district}`}
                  </span>
                </div>
                <div className="text-lg font-semibold">
                  S/ {formatPrice(field.price)}/h
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>4.5/5</span>
                </div>
              </div>

              {field.fieldFeatures && field.fieldFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.fieldFeatures.map((ff) => (
                    <Badge key={ff.id} variant="outline" className="gap-1">
                      <FeatureIcon
                        iconName={ff.feature.icon}
                        className="h-3.5 w-3.5"
                      />
                      <span>{ff.feature.name}</span>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <p className="text-2xl font-bold">
                    {statistics.totalReservations}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("fieldDetail.reservationCount")}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    S/ {formatPrice(statistics.totalRevenue)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("fieldDetail.income")}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{statistics.occupancy}%</p>
                  <p className="text-sm text-muted-foreground">
                    {t("fieldDetail.occupancyRate")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Horarios de Atención */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>{t("fieldDetail.schedules")}</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setEditingSchedule(null);
                  setScheduleModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("fieldDetail.addSchedule")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dayOrder.map((dayValue) => {
                const schedule = schedulesByDay.get(dayValue);
                const dayLabel = t(dayKeyMap[dayValue] || "");
                if (schedule) {
                  const hours = calculateHours(
                    schedule.startHour,
                    schedule.endHour
                  );
                  return (
                    <div
                      key={dayValue}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{dayLabel}</p>
                        <p className="text-sm text-muted-foreground">
                          {schedule.startHour} - {schedule.endHour} ({hours}{" "}
                          {t("fieldDetail.hours")})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${schedule.startHour}-${schedule.endHour}`
                            );
                            toast.success(t("fieldDetail.scheduleCopied"));
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSchedule(schedule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteScheduleId(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={dayValue}
                    className="flex items-center justify-between p-3 border border-dashed rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{dayLabel}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSchedule({ day: dayValue });
                        setScheduleModalOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("fieldDetail.configure")}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Horarios */}
        <ScheduleModal
          open={scheduleModalOpen}
          onOpenChange={(open) => {
            setScheduleModalOpen(open);
            if (!open) {
              setEditingSchedule(null);
            }
          }}
          onSave={handleSaveSchedule}
          initialDay={editingSchedule?.day}
          initialStartHour={editingSchedule?.startHour}
          initialEndHour={editingSchedule?.endHour}
          mode={editingSchedule?.id ? "edit" : "create"}
          scheduleId={editingSchedule?.id}
        />

        {/* Dialog de confirmación de eliminación */}
        <AlertDialog
          open={deleteScheduleId !== null}
          onOpenChange={(open) => !open && setDeleteScheduleId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("fieldDetail.deleteScheduleTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("fieldDetail.deleteScheduleDesc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteScheduleId) {
                    handleDeleteSchedule(deleteScheduleId);
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Widget de Calendario de Reservas */}
        <ReservationCalendar
          fieldId={fieldId}
          schedules={field.schedules || []}
          fieldHref={(id) => `/dashboard/fields/${id}`}
          reservations={
            field.reservations?.map((r) => ({
              id: r.id,
              startDate: new Date(r.startDate as string).toISOString(),
              endDate: new Date(r.endDate as string).toISOString(),
              status: r.status,
              amount: Number(r.amount),
              clientName:
                (r as { user?: { name: string | null } }).user?.name ??
                (r as { guestName: string | null }).guestName ??
                t("fieldDetail.guest"),
            })) || []
          }
        />

        {/* Botón de Editar */}
        <div className="flex justify-end">
          <Link href={`/dashboard/fields/${fieldId}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              {t("fieldDetail.editField")}
            </Button>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
