"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const manualReservationSchema = z
  .object({
    fieldId: z.string().min(1, "Selecciona una cancha"),
    startDate: z.string().min(1, "Fecha y hora de inicio requerida"),
    endDate: z.string().min(1, "Fecha y hora de fin requerida"),
    amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
    clientType: z.enum(["user", "guest"]),
    userId: z.string().optional(),
    guestName: z.string().optional(),
    guestEmail: z.string().email().optional().or(z.literal("")),
    guestPhone: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.clientType === "user") return !!data.userId;
      return true;
    },
    { message: "Selecciona un usuario", path: ["userId"] }
  )
  .refine(
    (data) => {
      if (data.clientType === "guest") {
        return (
          !!data.guestName?.trim() &&
          !!data.guestEmail?.trim() &&
          !!data.guestPhone?.trim()
        );
      }
      return true;
    },
    {
      message: "Nombre, email y teléfono son requeridos para invitado",
      path: ["guestName"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "La hora de fin debe ser posterior a la de inicio",
      path: ["endDate"],
    }
  );

type ManualReservationFormData = z.infer<typeof manualReservationSchema>;

export type FieldOption = { id: string; name: string; price: number };

interface ManualReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldOption[];
  onSuccess?: () => void;
}

function toISOString(localDateTime: string): string {
  if (!localDateTime) return "";
  const d = new Date(localDateTime);
  return d.toISOString();
}

export function ManualReservationModal({
  open,
  onOpenChange,
  fields,
  onSuccess,
}: ManualReservationModalProps) {
  const utils = trpc.useUtils();
  const { data: usersData } = trpc.user.getClients.useQuery(
    { limit: 200 },
    { enabled: open }
  );
  const users = usersData?.data ?? [];

  const form = useForm<ManualReservationFormData>({
    resolver: zodResolver(manualReservationSchema),
    defaultValues: {
      fieldId: "",
      startDate: "",
      endDate: "",
      amount: 0,
      clientType: "guest",
      userId: "",
      guestName: "",
      guestEmail: "",
      guestPhone: "",
    },
  });

  const clientType = form.watch("clientType");
  const fieldId = form.watch("fieldId");
  const [selectedDate, setSelectedDate] = useState("");
  const selectedSlot = form.watch("startDate") && form.watch("endDate");
  const selectedField = fields.find((f) => f.id === fieldId);
  const today = startOfDay(new Date());

  const { data: slots = [], isLoading: slotsLoading } =
    trpc.reservation.getAvailableSlots.useQuery(
      { fieldId, date: selectedDate },
      { enabled: !!fieldId && !!selectedDate }
    );

  useEffect(() => {
    if (open) setSelectedDate("");
  }, [open]);

  const createManual = trpc.reservation.createManual.useMutation({
    onSuccess: () => {
      utils.reservation.listForAdmin.invalidate();
      utils.reservation.listForOwner.invalidate();
      toast.success("Reserva creada correctamente");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo crear la reserva");
    },
  });

  function onSubmit(data: ManualReservationFormData) {
    const isGuest = data.clientType === "guest";
    createManual.mutate({
      fieldId: data.fieldId,
      startDate: toISOString(data.startDate),
      endDate: toISOString(data.endDate),
      amount: data.amount,
      userId: isGuest ? undefined : data.userId,
      guestName: isGuest ? data.guestName?.trim() : undefined,
      guestEmail: isGuest ? data.guestEmail?.trim() : undefined,
      guestPhone: isGuest ? data.guestPhone?.trim() : undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-foreground max-w-md max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-2">
          <DialogTitle className="text-foreground">
            Nueva reserva manual
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Crea una reserva eligiendo cancha, horario, monto y cliente
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-2 space-y-4">
              <FormField
                control={form.control}
                name="fieldId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancha</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedDate("");
                        form.setValue("startDate", "");
                        form.setValue("endDate", "");
                        form.setValue("amount", 0);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Selecciona una cancha" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fields.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={() => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base">
                        <CalendarDays className="h-4 w-4" />
                        Fecha y horario (obligatorio)
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Elige una fecha y un horario (1 o 2 h seguidas, igual
                        que los clientes). Solo se muestran horas libres.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <fieldset className="space-y-2 border-0 p-0 m-0">
                  <legend className="text-sm font-medium text-foreground">
                    Fecha (desde hoy)
                  </legend>
                  <Calendar
                    mode="single"
                    locale={es}
                    selected={
                      selectedDate
                        ? new Date(`${selectedDate}T12:00:00`)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (!date) return;
                      setSelectedDate(format(date, "yyyy-MM-dd"));
                      form.setValue("startDate", "");
                      form.setValue("endDate", "");
                      form.setValue("amount", 0);
                    }}
                    disabled={(date) => date < today}
                    className="rounded-md border border-border bg-background p-3"
                  />
                </fieldset>
                {fieldId && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Horarios (1 h) — los ocupados aparecen atenuados
                    </span>
                    {!selectedDate ? (
                      <p className="text-sm text-muted-foreground py-3 rounded-md bg-muted/50 px-3">
                        Selecciona una fecha arriba para ver los horarios de la
                        cancha.
                      </p>
                    ) : slotsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando horarios...
                      </div>
                    ) : slots.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">
                        No hay horarios definidos para ese día. Elige otra
                        fecha.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                        {slots.map((slot) => {
                          const isSelected =
                            slot.available &&
                            form.getValues("startDate") ===
                              new Date(slot.startLocal).toISOString();
                          const isOccupied = !slot.available;
                          return (
                            <button
                              key={slot.startLocal}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => {
                                if (isOccupied) return;
                                form.setValue(
                                  "startDate",
                                  new Date(slot.startLocal).toISOString()
                                );
                                form.setValue(
                                  "endDate",
                                  new Date(slot.endLocal).toISOString()
                                );
                                const amount =
                                  selectedField?.price != null
                                    ? Math.round(selectedField.price * 100) /
                                      100
                                    : 0;
                                form.setValue("amount", amount);
                              }}
                              className={cn(
                                "rounded-lg border px-3 py-2 text-sm font-medium transition-colors text-left",
                                isOccupied
                                  ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground opacity-75"
                                  : isSelected
                                    ? "border-primary bg-primary/15 text-primary"
                                    : "border-border bg-background hover:bg-muted text-foreground"
                              )}
                              title={isOccupied ? "Ocupado" : undefined}
                            >
                              {slot.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {selectedSlot && (
                      <p className="text-xs text-muted-foreground">
                        Horario elegido:{" "}
                        <span className="font-medium text-foreground">
                          {new Date(
                            form.getValues("startDate")
                          ).toLocaleTimeString("es", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          –{" "}
                          {new Date(
                            form.getValues("endDate")
                          ).toLocaleTimeString("es", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto (S/) — calculado por hora</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        readOnly
                        placeholder="Elige cancha y horario"
                        className="bg-muted/50 border-border text-foreground"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Precio de la cancha × 1 h
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="guest">
                          Invitado (datos manuales)
                        </SelectItem>
                        <SelectItem value="user">Usuario registrado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {clientType === "user" && (
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue placeholder="Selecciona un usuario" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name ?? u.email}{" "}
                              {u.email ? `(${u.email})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {clientType === "guest" && (
                <>
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del invitado</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre completo"
                            className="bg-background border-border text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@ejemplo.com"
                            className="bg-background border-border text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="guestPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: 999 888 777"
                            className="bg-background border-border text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <DialogFooter className="shrink-0 flex-wrap gap-2 justify-end pt-3 pb-6 px-6 border-t border-border bg-card">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={createManual.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={createManual.isPending || !selectedSlot}
              >
                {createManual.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear reserva"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
