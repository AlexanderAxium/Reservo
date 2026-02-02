"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ManualReservationModal } from "@/components/reservation/ManualReservationModal";
import { ReservationDetailModal } from "@/components/reservation/ReservationDetailModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import {
  Calendar,
  ChevronRight,
  Eye,
  MapPin,
  MoreHorizontal,
  Plus,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

const SPORT_LABELS: Record<string, string> = {
  FOOTBALL: "Fútbol",
  TENNIS: "Tenis",
  BASKETBALL: "Básquet",
  VOLLEYBALL: "Vóley",
  FUTSAL: "Futsal",
};

function StatusBadge({ status }: { status: string }) {
  const base =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium";
  if (status === "CONFIRMED" || status === "COMPLETED") {
    return (
      <span
        className={`${base} border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`}
      >
        {STATUS_LABELS[status] ?? status}
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span
        className={`${base} border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400`}
      >
        {STATUS_LABELS[status] ?? status}
      </span>
    );
  }
  if (status === "CANCELLED" || status === "NO_SHOW") {
    return (
      <span
        className={`${base} border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400`}
      >
        {STATUS_LABELS[status] ?? status}
      </span>
    );
  }
  return (
    <span className={`${base} border-border bg-muted text-muted-foreground`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

type FieldWithOwner = {
  id: string;
  name: string;
  sport: string;
  address: string;
  district: string | null;
  owner?: { id: string; name: string; email: string } | null;
};

export default function AdminReservationsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [fieldIdFilter, setFieldIdFilter] = useState<string | undefined>(
    undefined
  );
  const [ownerIdFilter, setOwnerIdFilter] = useState<string | undefined>(
    undefined
  );
  const [detailReservationId, setDetailReservationId] = useState<string | null>(
    null
  );
  const [manualModalOpen, setManualModalOpen] = useState(false);

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.reservation.listForAdmin.useQuery({
    page,
    limit: 10,
    status: statusFilter as
      | "PENDING"
      | "CONFIRMED"
      | "CANCELLED"
      | "COMPLETED"
      | "NO_SHOW"
      | undefined,
    fieldId: fieldIdFilter,
    ownerId: ownerIdFilter,
  });

  const updateStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => {
      utils.reservation.listForAdmin.invalidate();
      toast.success("Estado de reserva actualizado");
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo actualizar");
    },
  });

  const { data: fieldsData } = trpc.field.getAll.useQuery(
    { limit: 500 },
    { enabled: true }
  );

  const reservations = data?.data ?? [];
  const pagination = data?.pagination;

  const uniqueOwners = Array.from(
    new Map(
      (fieldsData?.data ?? [])
        .filter(
          (f): f is typeof f & { owner: NonNullable<typeof f.owner> } =>
            !!f.owner
        )
        .map((f) => [f.owner.id, { id: f.owner.id, name: f.owner.name }])
    ).values()
  );

  const uniqueFields = (fieldsData?.data ?? []).map((f) => ({
    id: f.id,
    name: f.name,
  }));

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/dashboard/admin/fields"
            className="hover:text-foreground transition-colors"
          >
            admin
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">reservations</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Todas las Reservas
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gestiona y confirma o cancela reservas del tenant
            </p>
          </div>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
            onClick={() => setManualModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Reserva Manual
          </Button>
        </div>

        <ReservationDetailModal
          reservationId={detailReservationId}
          onClose={() => setDetailReservationId(null)}
          fieldHref={(id) => `/dashboard/admin/fields/${id}`}
          onStatusUpdated={() => {
            utils.reservation.listForAdmin.invalidate();
          }}
        />
        <ManualReservationModal
          open={manualModalOpen}
          onOpenChange={setManualModalOpen}
          fields={uniqueFields}
          onSuccess={() => utils.reservation.listForAdmin.invalidate()}
        />

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Filtros</CardTitle>
            <CardDescription className="text-muted-foreground">
              Filtra por estado, cancha o propietario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="status-filter"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  Estado
                </label>
                <select
                  id="status-filter"
                  value={statusFilter ?? ""}
                  onChange={(e) => {
                    setStatusFilter(e.target.value || undefined);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Todos</option>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="field-filter"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  Cancha
                </label>
                <select
                  id="field-filter"
                  value={fieldIdFilter ?? ""}
                  onChange={(e) => {
                    setFieldIdFilter(e.target.value || undefined);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Todas</option>
                  {uniqueFields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="owner-filter"
                  className="text-sm font-medium text-foreground mb-2 block"
                >
                  Propietario
                </label>
                <select
                  id="owner-filter"
                  value={ownerIdFilter ?? ""}
                  onChange={(e) => {
                    setOwnerIdFilter(e.target.value || undefined);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Todos</option>
                  {uniqueOwners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Lista de reservas</CardTitle>
            <CardDescription className="text-muted-foreground">
              {pagination?.total ?? 0} reserva(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Cargando reservas...
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No hay reservas para mostrar
                </p>
                <Link href="/dashboard/admin/fields">
                  <Button variant="outline">Ver canchas</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-foreground font-medium">
                          Cancha
                        </TableHead>
                        <TableHead className="text-foreground font-medium">
                          Propietario
                        </TableHead>
                        <TableHead className="text-foreground font-medium">
                          Cliente / Invitado
                        </TableHead>
                        <TableHead className="text-foreground font-medium">
                          Fecha y hora
                        </TableHead>
                        <TableHead className="text-foreground font-medium">
                          Monto
                        </TableHead>
                        <TableHead className="text-foreground font-medium">
                          Estado
                        </TableHead>
                        <TableHead className="text-right text-foreground font-medium">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((r) => {
                        const start = new Date(r.startDate);
                        const end = new Date(r.endDate);
                        const clientName =
                          r.user?.name ?? r.guestName ?? "Invitado";
                        const clientEmail =
                          r.user?.email ?? r.guestEmail ?? "—";
                        const field = r.field as FieldWithOwner;
                        const owner = field?.owner ?? null;
                        const canConfirm = r.status === "PENDING";
                        const canCancel =
                          r.status === "PENDING" || r.status === "CONFIRMED";
                        return (
                          <TableRow key={r.id} className="border-border">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div>
                                  <p className="font-medium text-foreground">
                                    {r.field.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {SPORT_LABELS[r.field.sport] ??
                                      r.field.sport}
                                    {r.field.district &&
                                      ` • ${r.field.district}`}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {owner ? (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {owner.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {owner.email}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <p className="font-medium text-foreground">
                                {clientName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {clientEmail}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-foreground">
                                {start.toLocaleDateString("es-PE", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {start.toLocaleTimeString("es-PE", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                –{" "}
                                {end.toLocaleTimeString("es-PE", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-foreground">
                                S/ {formatPrice(Number(r.amount))}
                              </span>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={r.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    aria-label="Acciones"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48 bg-card border-border"
                                >
                                  <DropdownMenuItem
                                    className="cursor-pointer text-foreground"
                                    onClick={() => setDetailReservationId(r.id)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/dashboard/admin/fields/${r.field.id}`}
                                      className="cursor-pointer text-foreground"
                                    >
                                      Ver cancha
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {canConfirm && (
                                    <DropdownMenuItem
                                      className="text-emerald-600 dark:text-emerald-400 cursor-pointer"
                                      onClick={() =>
                                        updateStatus.mutate({
                                          id: r.id,
                                          status: "CONFIRMED",
                                        })
                                      }
                                      disabled={updateStatus.isPending}
                                    >
                                      Confirmar reserva
                                    </DropdownMenuItem>
                                  )}
                                  {canCancel && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 focus:bg-red-500/10"
                                        onClick={() =>
                                          updateStatus.mutate({
                                            id: r.id,
                                            status: "CANCELLED",
                                          })
                                        }
                                        disabled={updateStatus.isPending}
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Cancelar reserva
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Página {pagination.page} de {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasPrev}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="border-border text-foreground"
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasNext}
                        onClick={() => setPage((p) => p + 1)}
                        className="border-border text-foreground"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
