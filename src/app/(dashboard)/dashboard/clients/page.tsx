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
import { subDays, subMonths } from "date-fns";
import { UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useMemo, useState } from "react";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  _count: {
    reservations: number;
  };
  createdAt: string;
};

export default function ClientsPage() {
  const { t } = useTranslation("dashboard");
  const router = useRouter();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, isLoading, error } = trpc.user.getClients.useQuery({
    page,
    limit,
    search: search || undefined,
  });

  // Compute KPIs from current page data
  const kpiStats = useMemo(() => {
    const clients = data?.data || [];
    const oneMonthAgo = subMonths(new Date(), 1);
    const newThisMonth = clients.filter(
      (c) => new Date(c.createdAt) >= oneMonthAgo
    ).length;
    return {
      total: clients.length,
      newThisMonth,
    };
  }, [data?.data]);

  // Export function
  const handleExport = () => {
    if (!data?.data || data.data.length === 0) return;
    exportToCsv(
      data.data.map((c) => ({
        name: c.name,
        email: c.email,
        phone: c.phone || "-",
        reservations: c._count.reservations,
        registered: new Date(c.createdAt).toLocaleDateString("es-PE"),
      })),
      `clients-${new Date().toISOString().split("T")[0]}`,
      [
        { key: "name", label: t("clientsList.csvName") },
        { key: "email", label: t("clientsList.csvEmail") },
        { key: "phone", label: t("clientsList.csvPhone") },
        { key: "reservations", label: t("clientsList.csvReservations") },
        { key: "registered", label: t("clientsList.csvRegistered") },
      ]
    );
  };

  const columns: TableColumn<Client>[] = [
    {
      key: "name",
      title: t("clientsList.clientCol"),
      width: "200px",
      render: (_, record) => (
        <div>
          <p className="font-medium">{record.name}</p>
          <p className="text-xs text-muted-foreground">{record.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      title: t("clientsList.phoneCol"),
      width: "140px",
      render: (value) => (value != null && value !== "" ? String(value) : "-"),
    },
    {
      key: "_count",
      title: t("clientsList.reservationsCol"),
      width: "100px",
      render: (_, record) => (
        <Badge variant="secondary">{record._count.reservations}</Badge>
      ),
    },
    {
      key: "createdAt",
      title: t("clientsList.registeredCol"),
      width: "130px",
      render: (value): ReactNode =>
        new Date(value as Date).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  const actions: TableAction<Client>[] = [
    {
      label: t("clientsList.viewProfile"),
      onClick: (record) => router.push(`/dashboard/clients/${record.id}`),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("clientsList.title")}
        description={t("clientsList.description")}
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("clientsList.searchPlaceholder")}
      >
        <DateRangePicker dateRange={dateRange} onChange={setDateRange} />
        <ExportButton
          onExportCsv={handleExport}
          disabled={!data?.data || data.data.length === 0}
        />
      </FilterBar>

      <div className="grid grid-cols-2 gap-4">
        <KpiCard
          title={t("metricsPage.clients")}
          value={kpiStats.total}
          icon={Users}
        />
        <KpiCard
          title={t("clientsList.newThisMonth")}
          value={kpiStats.newThisMonth}
          icon={UserPlus}
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
        emptyMessage={t("clientsList.noClients")}
        emptyIcon={<Users className="h-12 w-12 text-muted-foreground" />}
      />
    </div>
  );
}
