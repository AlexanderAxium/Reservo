"use client";

import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/badge";
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
import type { PaymentStatus } from "@prisma/client";
import { subDays } from "date-fns";
import { Clock, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Payment = {
  id: string;
  amount: number | string;
  status: PaymentStatus;
  reservation: {
    id: string;
    field: {
      name: string;
    };
    user: {
      name: string;
      email: string;
    } | null;
    guestName: string | null;
  };
  paymentMethod: {
    name: string;
  } | null;
  createdAt: string;
};

function StatusBadge({
  status,
  labels,
}: {
  status: PaymentStatus;
  labels: Record<PaymentStatus, string>;
}) {
  const colors: Record<PaymentStatus, string> = {
    PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/50",
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/50",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/50",
    REFUNDED: "bg-blue-500/10 text-blue-600 border-blue-500/50",
    FAILED: "bg-red-500/10 text-red-600 border-red-500/50",
  };

  return (
    <Badge variant="soft" className={colors[status] || ""}>
      {labels[status] || status}
    </Badge>
  );
}

export default function PaymentsPage() {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [statusFilter, setStatusFilter] = useState<"" | PaymentStatus>("");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const STATUS_LABELS: Record<PaymentStatus, string> = {
    PENDING: t("statuses.pending"),
    PAID: t("statuses.paid"),
    CANCELLED: t("statuses.cancelled"),
    REFUNDED: t("statuses.refunded"),
    FAILED: t("statuses.failed"),
  };

  const { data, isLoading, error } = trpc.payment.list.useQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter === "" ? undefined : statusFilter,
  });

  // Compute KPIs from current page data
  const kpiStats = useMemo(() => {
    const payments = data?.data || [];
    const totalRevenue = payments.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );
    const pendingAmount = payments
      .filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    return {
      total: payments.length,
      revenue: totalRevenue,
      pending: pendingAmount,
    };
  }, [data?.data]);

  // Export function
  const handleExport = () => {
    if (!data?.data || data.data.length === 0) return;
    exportToCsv(
      data.data.map((p) => ({
        client: p.reservation.user?.name || p.reservation.guestName || "Guest",
        email: p.reservation.user?.email || "-",
        field: p.reservation.field.name,
        amount: `S/ ${formatPrice(Number(p.amount))}`,
        method: p.paymentMethod?.name || "-",
        status: STATUS_LABELS[p.status],
        date: new Date(p.createdAt).toLocaleDateString("es-PE"),
      })),
      `payments-${new Date().toISOString().split("T")[0]}`,
      [
        { key: "client", label: t("paymentsList.csvClient") },
        { key: "email", label: t("paymentsList.csvEmail") },
        { key: "field", label: t("paymentsList.csvField") },
        { key: "amount", label: t("paymentsList.csvAmount") },
        { key: "method", label: t("paymentsList.csvMethod") },
        { key: "status", label: t("paymentsList.csvStatus") },
        { key: "date", label: t("paymentsList.csvDate") },
      ]
    );
  };

  const columns: TableColumn<Payment>[] = [
    {
      key: "reservation",
      title: t("paymentsList.clientCol"),
      width: "180px",
      render: (_, record) => (
        <div>
          <p className="font-medium text-sm">
            {record.reservation.user?.name ||
              record.reservation.guestName ||
              t("paymentsList.guest")}
          </p>
          <p className="text-xs text-muted-foreground">
            {record.reservation.user?.email || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "reservation",
      title: t("paymentsList.fieldCol"),
      width: "160px",
      render: (_, record) => record.reservation.field.name,
    },
    {
      key: "amount",
      title: t("paymentsList.amountCol"),
      width: "100px",
      render: (value) => `S/ ${formatPrice(Number(value))}`,
    },
    {
      key: "paymentMethod",
      title: t("paymentsList.methodCol"),
      width: "120px",
      render: (_, record) => record.paymentMethod?.name || "-",
    },
    {
      key: "status",
      title: t("paymentsList.statusCol"),
      width: "120px",
      render: (value) => (
        <StatusBadge status={value as PaymentStatus} labels={STATUS_LABELS} />
      ),
    },
    {
      key: "createdAt",
      title: t("paymentsList.dateCol"),
      width: "130px",
      render: (value) =>
        new Date(value as Date).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  const actions: TableAction<Payment>[] = [
    {
      label: t("paymentsList.viewDetails"),
      onClick: (record) => router.push(`/dashboard/payments/${record.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("paymentsList.title")}
        description={t("paymentsList.description")}
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("paymentsList.searchPlaceholder")}
        filters={[
          {
            key: "status",
            label: t("paymentsList.allStatuses"),
            value: statusFilter || "all",
            options: [
              { label: t("paymentsList.allStatuses"), value: "all" },
              { label: t("paymentsList.pending"), value: "PENDING" },
              { label: t("paymentsList.paid"), value: "PAID" },
              { label: t("paymentsList.cancelled"), value: "CANCELLED" },
              { label: t("paymentsList.refunded"), value: "REFUNDED" },
              { label: t("paymentsList.failed"), value: "FAILED" },
            ],
            onChange: (val) => {
              setStatusFilter(val === "all" ? "" : (val as PaymentStatus));
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

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard
          title={t("paymentsList.totalPayments")}
          value={kpiStats.total}
          icon={CreditCard}
        />
        <KpiCard
          title={t("paymentsList.totalRevenue")}
          value={`S/ ${formatPrice(kpiStats.revenue)}`}
          icon={TrendingUp}
        />
        <KpiCard
          title={t("paymentsList.pendingAmount")}
          value={`S/ ${formatPrice(kpiStats.pending)}`}
          icon={Clock}
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
        emptyMessage={t("paymentsList.noPayments")}
        emptyIcon={<CreditCard className="h-12 w-12 text-muted-foreground" />}
      />
    </div>
  );
}
