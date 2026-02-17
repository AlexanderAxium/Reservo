"use client";

import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ScrollableTable,
  type TableAction,
  type TableColumn,
} from "@/components/ui/scrollable-table";
import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { exportToCsv } from "@/lib/export";
import { formatPrice } from "@/lib/utils";
import type { ReservationStatus, Sport } from "@prisma/client";
import { subDays } from "date-fns";
import {
  Calendar,
  CalendarX,
  CheckCircle,
  Clock,
  DollarSign,
  ListChecks,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Reservation = {
  id: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  amount: string;
  field: {
    id: string;
    name: string;
    sport: Sport;
  };
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  guestName: string | null;
  guestEmail: string | null;
  createdAt: string;
};

function StatusBadge({
  status,
  labels,
}: {
  status: ReservationStatus;
  labels: Record<ReservationStatus, string>;
}) {
  const colors: Record<ReservationStatus, string> = {
    CONFIRMED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/50",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/50",
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/50",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/50",
    NO_SHOW: "bg-red-500/10 text-red-600 border-red-500/50",
  };

  return (
    <Badge variant="soft" className={colors[status] || ""}>
      {labels[status] || status}
    </Badge>
  );
}

export default function ReservationsPage() {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [statusFilter, setStatusFilter] = useState<"" | ReservationStatus>("");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const STATUS_LABELS: Record<ReservationStatus, string> = {
    PENDING: t("statuses.pending"),
    CONFIRMED: t("statuses.confirmed"),
    CANCELLED: t("statuses.cancelled"),
    COMPLETED: t("statuses.completed"),
    NO_SHOW: t("statuses.noShow"),
  };

  const { data, isLoading, error } = trpc.reservation.listForTenant.useQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter === "" ? undefined : statusFilter,
  });

  // Compute KPIs from current page data
  const kpiStats = useMemo(() => {
    const reservations = data?.data || [];
    return {
      total: reservations.length,
      confirmed: reservations.filter((r) => r.status === "CONFIRMED").length,
      pending: reservations.filter((r) => r.status === "PENDING").length,
      revenue: reservations.reduce(
        (sum, r) => sum + (Number(r.amount) || 0),
        0
      ),
    };
  }, [data?.data]);

  // Export function
  const handleExport = () => {
    if (!data?.data || data.data.length === 0) return;
    exportToCsv(
      data.data.map((r) => ({
        field: r.field.name,
        sport: r.field.sport,
        client: r.user?.name || r.guestName || "Guest",
        email: r.user?.email || r.guestEmail || "-",
        date: new Date(r.startDate).toLocaleDateString("es-PE"),
        startTime: new Date(r.startDate).toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: new Date(r.endDate).toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        amount: `S/ ${formatPrice(Number(r.amount))}`,
        status: STATUS_LABELS[r.status],
        created: new Date(r.createdAt).toLocaleDateString("es-PE"),
      })),
      `reservations-${new Date().toISOString().split("T")[0]}`,
      [
        { key: "field", label: "Field" },
        { key: "sport", label: "Sport" },
        { key: "client", label: "Client" },
        { key: "email", label: "Email" },
        { key: "date", label: "Date" },
        { key: "startTime", label: "Start Time" },
        { key: "endTime", label: "End Time" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "created", label: "Created" },
      ]
    );
  };

  const columns: TableColumn<Reservation>[] = [
    {
      key: "field",
      title: t("reservationsList.fieldCol"),
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
      title: t("reservationsList.clientCol"),
      width: "160px",
      render: (_, record) => (
        <div>
          <p className="font-medium text-sm">
            {record.user?.name ||
              record.guestName ||
              t("reservationsList.guest")}
          </p>
          <p className="text-xs text-muted-foreground">
            {record.user?.email || record.guestEmail || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "startDate",
      title: t("reservationsList.dateCol"),
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
      title: t("reservationsList.scheduleCol"),
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
      title: t("reservationsList.amountCol"),
      width: "100px",
      render: (value) => `S/ ${formatPrice(Number(value))}`,
    },
    {
      key: "status",
      title: t("reservationsList.statusCol"),
      width: "120px",
      render: (value) => (
        <StatusBadge
          status={value as ReservationStatus}
          labels={STATUS_LABELS}
        />
      ),
    },
    {
      key: "createdAt",
      title: t("reservationsList.createdCol"),
      width: "110px",
      render: (value) =>
        new Date(value as string).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
        }),
    },
  ];

  const actions: TableAction<Reservation>[] = [
    {
      label: t("reservationsList.viewDetails"),
      onClick: (record) => router.push(`/dashboard/reservations/${record.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("reservationsList.title")}
        description={t("reservationsList.description")}
        actions={
          <>
            <Link href="/dashboard/reservations/calendar">
              <Button variant="outline" size="sm">
                <Calendar className="size-4" />
                {t("reservationsList.calendarView")}
              </Button>
            </Link>
            <Link href="/dashboard/reservations/new">
              <Button size="sm">
                <Plus className="size-4" />
                {t("reservationsList.newReservation")}
              </Button>
            </Link>
          </>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("reservationsList.searchPlaceholder")}
        filters={[
          {
            key: "status",
            label: t("reservationsList.allStatuses"),
            value: statusFilter || "all",
            options: [
              {
                label: t("reservationsList.allStatuses"),
                value: "all",
              },
              {
                label: t("reservationsList.pending"),
                value: "PENDING",
              },
              {
                label: t("reservationsList.confirmed"),
                value: "CONFIRMED",
              },
              {
                label: t("reservationsList.completed"),
                value: "COMPLETED",
              },
              {
                label: t("reservationsList.cancelled"),
                value: "CANCELLED",
              },
              {
                label: t("reservationsList.noShow"),
                value: "NO_SHOW",
              },
            ],
            onChange: (val) => {
              setStatusFilter(val === "all" ? "" : (val as ReservationStatus));
              setPage(1);
            },
          },
        ]}
      >
        <DateRangePicker dateRange={dateRange} onChange={setDateRange} />
        <ExportButton
          onExportCsv={handleExport}
          disabled={!data?.data || data.data.length === 0}
        />
      </FilterBar>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          title={t("overview.totalReservations")}
          value={kpiStats.total}
          icon={ListChecks}
        />
        <KpiCard
          title={t("statuses.confirmed")}
          value={kpiStats.confirmed}
          icon={CheckCircle}
        />
        <KpiCard
          title={t("statuses.pending")}
          value={kpiStats.pending}
          icon={Clock}
        />
        <KpiCard
          title={t("overview.periodRevenue")}
          value={`S/ ${formatPrice(kpiStats.revenue)}`}
          icon={DollarSign}
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
        emptyMessage={t("reservationsList.noReservations")}
        emptyIcon={<CalendarX className="h-12 w-12 text-muted-foreground" />}
        emptyAction={
          <Link href="/dashboard/reservations/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {t("reservationsList.newReservation")}
            </Button>
          </Link>
        }
      />
    </div>
  );
}
