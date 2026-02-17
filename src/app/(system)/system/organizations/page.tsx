"use client";

import { ExportButton } from "@/components/dashboard/ExportButton";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import {
  ScrollableTable,
  type TableAction,
  type TableColumn,
} from "@/components/ui/scrollable-table";
import { useImpersonation } from "@/hooks/useImpersonation";
import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { exportToCsv } from "@/lib/export";
import { Building2, CheckCircle, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Tenant = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    fields?: number;
    users?: number;
  };
};

export default function Organizations() {
  const { t } = useTranslation("dashboard");
  const router = useRouter();
  const { startImpersonation } = useImpersonation();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading, error } = trpc.tenant.list.useQuery({
    page,
    limit,
    search: search || undefined,
  });

  const filteredData = data?.data.filter((tenant) => {
    const matchesPlan = planFilter === "all" || tenant.plan === planFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && tenant.isActive) ||
      (statusFilter === "inactive" && !tenant.isActive);
    return matchesPlan && matchesStatus;
  });

  // Compute KPIs
  const kpiStats = useMemo(() => {
    const orgs = data?.data || [];
    const active = orgs.filter((o) => o.isActive).length;
    const totalUsers = orgs.reduce((sum, o) => sum + (o._count?.users || 0), 0);
    return {
      total: orgs.length,
      active,
      users: totalUsers,
    };
  }, [data?.data]);

  // Export function
  const handleExport = () => {
    if (!filteredData || filteredData.length === 0) return;
    exportToCsv(
      filteredData.map((t) => ({
        name: t.name,
        slug: t.slug,
        plan: t.plan.toUpperCase(),
        status: t.isActive ? "Active" : "Inactive",
        fields: t._count?.fields || 0,
        users: t._count?.users || 0,
        created: new Date(t.createdAt).toLocaleDateString(),
      })),
      `organizations-${new Date().toISOString().split("T")[0]}`,
      [
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "plan", label: "Plan" },
        { key: "status", label: "Status" },
        { key: "fields", label: "Fields" },
        { key: "users", label: "Users" },
        { key: "created", label: "Created" },
      ]
    );
  };

  const columns: TableColumn<Tenant>[] = [
    {
      key: "name",
      title: t("system.name"),
      width: "200px",
      render: (_, record) => (
        <div>
          <p className="font-medium">{record.name}</p>
          <p className="text-xs text-muted-foreground">{record.slug}</p>
        </div>
      ),
    },
    {
      key: "plan",
      title: t("system.plan"),
      width: "100px",
      badge: (_, record) => ({
        label: record.plan.toUpperCase(),
        variant: record.plan === "enterprise" ? "default" : "secondary",
      }),
    },
    {
      key: "isActive",
      title: t("system.status"),
      width: "100px",
      badge: (_, record) => ({
        label: record.isActive ? t("system.active") : t("system.inactive"),
        variant: record.isActive ? "default" : "secondary",
      }),
    },
    {
      key: "_count",
      title: t("system.fields"),
      width: "80px",
      render: (_, record) => record._count?.fields || 0,
    },
    {
      key: "_count",
      title: t("system.users"),
      width: "80px",
      render: (_, record) => record._count?.users || 0,
    },
    {
      key: "createdAt",
      title: t("system.created"),
      width: "120px",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  const actions: TableAction<Tenant>[] = [
    {
      label: t("system.enterDashboard"),
      onClick: (record) =>
        startImpersonation({
          id: record.id,
          name: record.name,
        }),
    },
    {
      label: t("system.view"),
      onClick: (record) => router.push(`/system/organizations/${record.id}`),
    },
    {
      label: t("system.edit"),
      onClick: (record) =>
        router.push(`/system/organizations/${record.id}/edit`),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={t("system.organizations")}
        description={t("system.organizationsDesc")}
        actions={
          <Link href="/system/organizations/new">
            <Button size="sm">
              <Plus className="size-4" />
              {t("system.newOrganization")}
            </Button>
          </Link>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("system.searchOrgsPlaceholder")}
        filters={[
          {
            key: "plan",
            label: t("system.plan"),
            value: planFilter,
            options: [
              { label: t("system.allPlans"), value: "all" },
              { label: t("system.free"), value: "FREE" },
              { label: t("system.basic"), value: "BASIC" },
              { label: t("system.professional"), value: "PROFESSIONAL" },
              { label: t("system.enterprise"), value: "ENTERPRISE" },
            ],
            onChange: setPlanFilter,
          },
          {
            key: "status",
            label: t("system.status"),
            value: statusFilter,
            options: [
              { label: t("system.allStatus"), value: "all" },
              { label: t("system.active"), value: "active" },
              { label: t("system.inactive"), value: "inactive" },
            ],
            onChange: setStatusFilter,
          },
        ]}
      >
        <ExportButton
          onExportCsv={handleExport}
          disabled={!filteredData || filteredData.length === 0}
        />
      </FilterBar>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard
          title={t("system.totalOrganizations")}
          value={kpiStats.total}
          icon={Building2}
        />
        <KpiCard
          title={t("system.active")}
          value={kpiStats.active}
          icon={CheckCircle}
        />
        <KpiCard
          title={t("system.totalUsers")}
          value={kpiStats.users}
          icon={Users}
        />
      </div>

      <ScrollableTable
        data={filteredData || []}
        columns={columns}
        actions={actions}
        loading={isLoading}
        error={error?.message}
        pagination={data?.pagination}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
        emptyMessage={t("system.noOrganizationsFound")}
      />
    </div>
  );
}
