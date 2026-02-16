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
import type { PaymentStatus } from "@prisma/client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
  FAILED: "Fallido",
};

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

function StatusBadge({ status }: { status: PaymentStatus }) {
  const colors: Record<PaymentStatus, string> = {
    PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/50",
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/50",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/50",
    REFUNDED: "bg-blue-500/10 text-blue-600 border-blue-500/50",
    FAILED: "bg-red-500/10 text-red-600 border-red-500/50",
  };

  return (
    <Badge variant="outline" className={colors[status] || ""}>
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

export default function PaymentsPage() {
  const router = useRouter();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [statusFilter, setStatusFilter] = useState<"" | PaymentStatus>("");

  const { data, isLoading, error } = trpc.payment.list.useQuery({
    page,
    limit,
    search: search || undefined,
    status: (statusFilter === "" ? undefined : statusFilter) as any,
  });

  const columns: TableColumn<Payment>[] = [
    {
      key: "reservation",
      title: "Cliente",
      width: "180px",
      render: (_, record) => (
        <div>
          <p className="font-medium text-sm">
            {record.reservation.user?.name ||
              record.reservation.guestName ||
              "Invitado"}
          </p>
          <p className="text-xs text-muted-foreground">
            {record.reservation.user?.email || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "reservation",
      title: "Cancha",
      width: "160px",
      render: (_, record) => record.reservation.field.name,
    },
    {
      key: "amount",
      title: "Monto",
      width: "100px",
      render: (value) => `S/ ${formatPrice(Number(value))}`,
    },
    {
      key: "paymentMethod",
      title: "Método",
      width: "120px",
      render: (_, record) => record.paymentMethod?.name || "-",
    },
    {
      key: "status",
      title: "Estado",
      width: "120px",
      render: (value) => <StatusBadge status={value as PaymentStatus} />,
    },
    {
      key: "createdAt",
      title: "Fecha",
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
      label: "Ver detalles",
      onClick: (record) => router.push(`/dashboard/payments/${record.id}`),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pagos</h1>
          <p className="text-muted-foreground">
            Gestiona los pagos y transacciones
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as "" | PaymentStatus);
            setPage(1);
          }}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="PAID">Pagado</option>
          <option value="CANCELLED">Cancelado</option>
          <option value="REFUNDED">Reembolsado</option>
          <option value="FAILED">Fallido</option>
        </select>
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
        emptyMessage="No se encontraron pagos"
      />
    </div>
  );
}
