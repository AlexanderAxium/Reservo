"use client";

import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  ScrollableTable,
  type TableAction,
  type TableColumn,
} from "@/components/ui/scrollable-table";
import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/hooks/useTRPC";
import { formatPrice } from "@/lib/utils";
import type { ReservationStatus } from "@prisma/client";
import { subDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
};

type Reservation = {
  id: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  amount: string;
  field: {
    id: string;
    name: string;
    sport: string;
  };
  createdAt: string;
};

function StatusBadge({ status }: { status: ReservationStatus }) {
  const colors: Record<ReservationStatus, string> = {
    CONFIRMED: "text-emerald-600",
    COMPLETED: "text-emerald-600",
    PENDING: "text-amber-600",
    CANCELLED: "text-red-600",
    NO_SHOW: "text-red-600",
  };

  return (
    <Badge variant="soft" className={colors[status] || ""}>
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

export default function MyReservationsPage() {
  const router = useRouter();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [statusFilter, setStatusFilter] = useState<"" | ReservationStatus>("");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, isLoading, error } = trpc.reservation.myReservations.useQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter === "" ? undefined : statusFilter,
    startDate: dateRange.from.toISOString().split("T")[0],
    endDate: dateRange.to.toISOString().split("T")[0],
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
        new Date(value as string).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "schedule",
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
      render: (value) => <StatusBadge status={value as ReservationStatus} />,
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
      <PageHeader
        title="Mis Reservas"
        description="Historial completo de todas tus reservas"
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por cancha..."
        filters={[
          {
            key: "status",
            label: "Estado",
            value: statusFilter || "all",
            options: [
              { label: "Todos los estados", value: "all" },
              { label: "Confirmada", value: "CONFIRMED" },
              { label: "Pendiente", value: "PENDING" },
              { label: "Completada", value: "COMPLETED" },
              { label: "Cancelada", value: "CANCELLED" },
              { label: "No asistió", value: "NO_SHOW" },
            ],
            onChange: (val) => {
              setStatusFilter(val === "all" ? "" : (val as ReservationStatus));
              setPage(1);
            },
          },
        ]}
      >
        <DateRangePicker dateRange={dateRange} onChange={setDateRange} />
      </FilterBar>

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
