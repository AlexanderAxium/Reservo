"use client";

import { ScheduleModal } from "@/components/fields/ScheduleModal";
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
import type { WeekDay } from "@prisma/client";
import { ArrowLeft, Calendar, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const weekDays: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const dayOrder = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function FieldSchedulePage() {
  const params = useParams();
  const fieldId = params.id as string;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<{
    id: string;
    day: string;
    startHour: string;
    endHour: string;
  } | null>(null);

  const { data: field, isLoading: fieldLoading } = trpc.field.getById.useQuery({
    id: fieldId,
  });

  const { data: schedules = [], refetch } = trpc.field.getSchedules.useQuery({
    fieldId,
  });

  const createSchedule = trpc.field.createSchedule.useMutation({
    onSuccess: () => {
      toast.success("Horario creado correctamente");
      refetch();
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear horario");
    },
  });

  const updateSchedule = trpc.field.updateSchedule.useMutation({
    onSuccess: () => {
      toast.success("Horario actualizado correctamente");
      refetch();
      setModalOpen(false);
      setEditingSchedule(null);
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar horario");
    },
  });

  const deleteSchedule = trpc.field.deleteSchedule.useMutation({
    onSuccess: () => {
      toast.success("Horario eliminado correctamente");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar horario");
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
    if (confirm("¿Estás seguro de eliminar este horario?")) {
      deleteSchedule.mutate({ scheduleId: id });
    }
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
        <div className="text-center py-8">Cargando...</div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Cancha no encontrada</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/fields/${fieldId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Horarios - {field.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configura los horarios de disponibilidad para cada día de la semana
          </p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Horario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Horarios Semanales
          </CardTitle>
          <CardDescription>
            Define los horarios de apertura y cierre para cada día
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No hay horarios configurados
              </p>
              <Button onClick={handleOpenNew}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir Primer Horario
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayOrder.map((day) => {
                const schedule = schedulesByDay[day];
                return (
                  <div
                    key={day}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="min-w-[120px]">
                        <p className="font-medium">{weekDays[day]}</p>
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
                        <Badge variant="secondary">Cerrado</Badge>
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
                        Añadir
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
    </div>
  );
}
