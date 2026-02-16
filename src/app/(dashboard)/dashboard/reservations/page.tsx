"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ScrollableTable,
  type TableAction,
  type TableColumn,
} from "@/components/ui/scrollable-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/lib/utils";
import type { ReservationStatus, Sport } from "@prisma/client";
import { Calendar, CalendarX, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <Badge variant="outline" className={colors[status] || ""}>
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("reservationsList.title")}</h1>
          <p className="text-muted-foreground">
            {t("reservationsList.description")}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/reservations/calendar">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              {t("reservationsList.calendarView")}
            </Button>
          </Link>
          <Link href="/dashboard/reservations/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("reservationsList.newReservation")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("reservationsList.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter || "__all__"}
          onValueChange={(val) => {
            setStatusFilter(
              val === "__all__" ? "" : (val as ReservationStatus)
            );
            setPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">
              {t("reservationsList.allStatuses")}
            </SelectItem>
            <SelectItem value="PENDING">
              {t("reservationsList.pending")}
            </SelectItem>
            <SelectItem value="CONFIRMED">
              {t("reservationsList.confirmed")}
            </SelectItem>
            <SelectItem value="COMPLETED">
              {t("reservationsList.completed")}
            </SelectItem>
            <SelectItem value="CANCELLED">
              {t("reservationsList.cancelled")}
            </SelectItem>
            <SelectItem value="NO_SHOW">
              {t("reservationsList.noShow")}
            </SelectItem>
          </SelectContent>
        </Select>
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
