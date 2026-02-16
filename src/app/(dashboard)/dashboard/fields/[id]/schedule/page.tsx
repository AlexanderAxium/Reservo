"use client";

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
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import type { WeekDay } from "@prisma/client";
import { ArrowLeft, Calendar, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
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

export default function FieldSchedulePage() {
  const params = useParams();
  const fieldId = params.id as string;
  const { t } = useTranslation("dashboard");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<{
    id: string;
    day: string;
    startHour: string;
    endHour: string;
  } | null>(null);
  const [deleteScheduleId, setDeleteScheduleId] = useState<string | null>(null);

  const { data: field, isLoading: fieldLoading } = trpc.field.getById.useQuery({
    id: fieldId,
  });

  const { data: schedules = [], refetch } = trpc.field.getSchedules.useQuery({
    fieldId,
  });

  const createSchedule = trpc.field.createSchedule.useMutation({
    onSuccess: () => {
      toast.success(t("fieldSchedule.scheduleCreated"));
      refetch();
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || t("fieldSchedule.scheduleCreateError"));
    },
  });

  const updateSchedule = trpc.field.updateSchedule.useMutation({
    onSuccess: () => {
      toast.success(t("fieldSchedule.scheduleUpdated"));
      refetch();
      setModalOpen(false);
      setEditingSchedule(null);
    },
    onError: (error) => {
      toast.error(error.message || t("fieldSchedule.scheduleUpdateError"));
    },
  });

  const deleteScheduleMutation = trpc.field.deleteSchedule.useMutation({
    onSuccess: () => {
      toast.success(t("fieldSchedule.scheduleDeleted"));
      refetch();
      setDeleteScheduleId(null);
    },
    onError: (error) => {
      toast.error(error.message || t("fieldSchedule.scheduleDeleteError"));
    },
  });

  const handleSave = (day: string, startHour: string, endHour: string) => {
    if (editingSchedule) {
      updateSchedule.mutate({
        scheduleId: editingSchedule.id,
        startHour,
        endHour,
      });
    } else {
      createSchedule.mutate({
        fieldId,
        day: day as WeekDay,
        startHour,
        endHour,
      });
    }
  };

  const handleEdit = (schedule: {
    id: string;
    day: string;
    startHour: string;
    endHour: string;
  }) => {
    setEditingSchedule(schedule);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteScheduleId(id);
  };

  const handleOpenNew = () => {
    setEditingSchedule(null);
    setModalOpen(true);
  };

  const schedulesByDay = schedules.reduce(
    (acc, schedule) => {
      acc[schedule.day] = schedule;
      return acc;
    },
    {} as Record<string, (typeof schedules)[0]>
  );

  if (fieldLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          {t("fieldSchedule.loadingField")}
        </div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          {t("fieldSchedule.fieldNotFound")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/fields/${fieldId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("fieldSchedule.back")}
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {t("fieldSchedule.title", { name: field.name })}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("fieldSchedule.description")}
          </p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t("fieldSchedule.addSchedule")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("fieldSchedule.weeklySchedules")}
          </CardTitle>
          <CardDescription>
            {t("fieldSchedule.weeklySchedulesDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {t("fieldSchedule.noSchedules")}
              </p>
              <Button onClick={handleOpenNew}>
                <Plus className="mr-2 h-4 w-4" />
                {t("fieldSchedule.addFirstSchedule")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayOrder.map((day) => {
                const schedule = schedulesByDay[day];
                const dayLabel = t(dayKeyMap[day] || "");
                return (
                  <div
                    key={day}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="min-w-[120px]">
                        <p className="font-medium">{dayLabel}</p>
                      </div>
                      {schedule ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {schedule.startHour}
                          </Badge>
                          <span className="text-muted-foreground">–</span>
                          <Badge variant="outline" className="font-mono">
                            {schedule.endHour}
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="secondary">
                          {t("fieldSchedule.closed")}
                        </Badge>
                      )}
                    </div>
                    {schedule ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(schedule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSchedule({
                            id: "",
                            day,
                            startHour: "",
                            endHour: "",
                          });
                          setModalOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t("fieldSchedule.add")}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ScheduleModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingSchedule(null);
        }}
        onSave={handleSave}
        initialDay={editingSchedule?.day}
        initialStartHour={editingSchedule?.startHour}
        initialEndHour={editingSchedule?.endHour}
        mode={editingSchedule?.id ? "edit" : "create"}
      />

      {/* AlertDialog to replace confirm() */}
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
              {t("fieldSchedule.deleteConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteScheduleId) {
                  deleteScheduleMutation.mutate({
                    scheduleId: deleteScheduleId,
                  });
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
