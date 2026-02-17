"use client";

import { ExportButton } from "@/components/dashboard/ExportButton";
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
import { useTranslation } from "@/hooks/useTranslation";
import { exportToCsv } from "@/lib/export";
import { DEFAULT_ROLES } from "@/types/rbac";
import { useRouter } from "next/navigation";
import { useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  tenantId: string | null;
  tenant?: {
    name: string;
  } | null;
  userRoles?: Array<{
    role: {
      name: string;
      displayName: string;
      isActive: boolean;
    };
  }>;
  createdAt: string;
};

export default function Users() {
  const { t } = useTranslation("dashboard");
  const router = useRouter();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data, isLoading, error } = trpc.user.getAll.useQuery({
    page,
    limit,
    search: search || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
  });

  // Export function
  const handleExport = () => {
    if (!data?.data || data.data.length === 0) return;
    exportToCsv(
      data.data.map((u) => {
        const roles = u.userRoles?.map((ur) => ur.role) ?? [];
        const activeRole = roles.find((r) => r.isActive) ?? roles[0];
        return {
          name: u.name,
          email: u.email,
          role: activeRole ? (activeRole.displayName ?? activeRole.name) : "-",
          organization: u.tenant?.name || "-",
          joined: new Date(u.createdAt).toLocaleDateString(),
        };
      }),
      `users-${new Date().toISOString().split("T")[0]}`,
      [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Primary Role" },
        { key: "organization", label: "Organization" },
        { key: "joined", label: "Joined" },
      ]
    );
  };

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      title: t("system.name"),
      width: "200px",
      render: (_, record) => (
        <div>
          <p className="font-medium">{record.name}</p>
          <p className="text-xs text-muted-foreground">{record.email}</p>
        </div>
      ),
    },
    {
      key: "roles",
      title: t("system.primaryRole"),
      width: "150px",
      render: (_, record) => {
        const roles = record.userRoles?.map((ur) => ur.role) ?? [];
        const activeRole = roles.find((r) => r.isActive) ?? roles[0];
        return activeRole ? (
          <Badge variant="outline">
            {activeRole.displayName ?? activeRole.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground">{t("system.noRole")}</span>
        );
      },
    },
    {
      key: "tenant",
      title: t("system.organization"),
      width: "200px",
      render: (_, record) =>
        record.tenant?.name || <span className="text-muted-foreground">-</span>,
    },
    {
      key: "createdAt",
      title: t("system.joined"),
      width: "120px",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  const actions: TableAction<User>[] = [
    {
      label: t("system.viewDetails"),
      onClick: (record) => router.push(`/system/users/${record.id}`),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={t("system.users")}
        description={t("system.usersDesc")}
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("system.searchUsersPlaceholder")}
        filters={[
          {
            key: "role",
            label: t("system.filterByRole"),
            value: roleFilter,
            options: [
              { label: t("system.allRoles"), value: "all" },
              {
                label: t("system.sysAdminRole"),
                value: DEFAULT_ROLES.SYS_ADMIN,
              },
              {
                label: t("system.tenantAdminRole"),
                value: DEFAULT_ROLES.TENANT_ADMIN,
              },
              {
                label: t("system.tenantStaffRole"),
                value: DEFAULT_ROLES.TENANT_STAFF,
              },
              { label: t("system.clientRole"), value: DEFAULT_ROLES.CLIENT },
            ],
            onChange: setRoleFilter,
          },
        ]}
      >
        <ExportButton
          onExportCsv={handleExport}
          disabled={!data?.data || data.data.length === 0}
        />
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
        emptyMessage={t("system.noUsersFound")}
      />
    </div>
  );
}
