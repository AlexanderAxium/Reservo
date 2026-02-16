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
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

type ReservationStatusFilter =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

type Reservation = {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  status: string;
  amount: number | string;
  field: {
    id: string;
    name: string;
    sport: string;
  };
  createdAt: string | Date;
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

export default function MyReservationsPage() {
  const router = useRouter();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [statusFilter, setStatusFilter] = useState<
    "" | ReservationStatusFilter
  >("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data, isLoading, error } = trpc.reservation.myReservations.useQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter === "" ? undefined : statusFilter,
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
          <p className="font-medium text-sm">{record.field.name}</p>
          <p className="text-xs text-muted-foreground">{record.field.sport}</p>
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
      render: (_, record) =>
        `${new Date(record.startDate).toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${new Date(record.endDate).toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
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
  ];

  const actions: TableAction<Reservation>[] = [
    {
      label: "Ver detalles",
      onClick: (record) => router.push(`/my/reservations/${record.id}`),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mis Reservas</h1>
        <p className="text-muted-foreground">
          Historial completo de todas tus reservas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cancha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as "" | ReservationStatusFilter);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Todos los estados</option>
          <option value="CONFIRMED">Confirmada</option>
          <option value="PENDING">Pendiente</option>
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
        emptyMessage="No tienes reservas"
      />
    </div>
  );
}
