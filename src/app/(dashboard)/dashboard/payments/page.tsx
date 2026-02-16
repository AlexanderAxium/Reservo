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
import type { PaymentStatus } from "@prisma/client";
import { CreditCard, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <Badge variant="outline" className={colors[status] || ""}>
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("paymentsList.title")}</h1>
          <p className="text-muted-foreground">
            {t("paymentsList.description")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("paymentsList.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter || "__all__"}
          onValueChange={(val) => {
            setStatusFilter(val === "__all__" ? "" : (val as PaymentStatus));
            setPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">
              {t("paymentsList.allStatuses")}
            </SelectItem>
            <SelectItem value="PENDING">{t("paymentsList.pending")}</SelectItem>
            <SelectItem value="PAID">{t("paymentsList.paid")}</SelectItem>
            <SelectItem value="CANCELLED">
              {t("paymentsList.cancelled")}
            </SelectItem>
            <SelectItem value="REFUNDED">
              {t("paymentsList.refunded")}
            </SelectItem>
            <SelectItem value="FAILED">{t("paymentsList.failed")}</SelectItem>
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
        emptyMessage={t("paymentsList.noPayments")}
        emptyIcon={<CreditCard className="h-12 w-12 text-muted-foreground" />}
      />
    </div>
  );
}
