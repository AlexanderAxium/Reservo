"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ScrollableTable,
  type TableAction,
  type TableColumn,
} from "@/components/ui/scrollable-table";
import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/hooks/useTRPC";
import { formatPrice } from "@/lib/utils";
import { Calendar, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

type Reservation = {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
  amount: number;
  field: {
    id: string;
    name: string;
    sport: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  guestName: string | null;
  guestEmail: string | null;
  createdAt: Date;
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    CONFIRMED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/50",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/50",
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/50",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/50",
    NO_SHOW: "bg-red-500/10 text-red-600 border-red-500/50",
  };

  return (
    <Badge variant="outline" className={colors[status] || ""}>
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

export default function ReservationsPage() {
  const router = useRouter();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data, isLoading, error } = trpc.reservation.listForTenant.useQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const columns: TableColumn<Reservation>[] = [
    {
      key: "field",
      title: "Cancha",
      width: "180px",
      render: (_, record) => (
        <div>
          <p className="font-medium">{record.field.name}</p>
          <p className="text-xs text-muted-foreground">{record.field.sport}</p>
        </div>
      ),
    },
    {
      key: "user",
      title: "Cliente",
      width: "160px",
      render: (_, record) => (
        <div>
          <p className="font-medium text-sm">
            {record.user?.name || record.guestName || "Invitado"}
          </p>
          <p className="text-xs text-muted-foreground">
            {record.user?.email || record.guestEmail || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "startDate",
      title: "Fecha",
      width: "130px",
      render: (value) =>
        new Date(value as Date).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "startDate",
      title: "Horario",
      width: "120px",
      render: (_, record) => (
        <div className="text-sm">
          {new Date(record.startDate).toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(record.endDate).toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      key: "amount",
      title: "Monto",
      width: "100px",
      render: (value) => `S/ ${formatPrice(Number(value))}`,
    },
    {
      key: "status",
      title: "Estado",
      width: "120px",
      render: (value) => <StatusBadge status={value as string} />,
    },
    {
      key: "createdAt",
      title: "Creada",
      width: "110px",
      render: (value) =>
        new Date(value as Date).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
        }),
    },
  ];

  const actions: TableAction<Reservation>[] = [
    {
      label: "Ver detalles",
      onClick: (record) => router.push(`/dashboard/reservations/${record.id}`),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reservas</h1>
          <p className="text-muted-foreground">
            Gestiona todas las reservas de tus canchas
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/reservations/calendar">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Vista Calendario
            </Button>
          </Link>
          <Link href="/dashboard/reservations/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reserva
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente o cancha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="CONFIRMED">Confirmada</option>
          <option value="COMPLETED">Completada</option>
          <option value="CANCELLED">Cancelada</option>
          <option value="NO_SHOW">No asistió</option>
        </select>
        <Input
          type="date"
          placeholder="Desde"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(1);
          }}
        />
        <Input
          type="date"
          placeholder="Hasta"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <ScrollableTable
        data={data?.data || []}
        columns={columns}
        actions={actions}
        loading={isLoading}
        error={error?.message}
        pagination={data?.pagination}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
        emptyMessage="No se encontraron reservas"
      />
    </div>
  );
}
