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
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
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

  const columns: TableColumn<Tenant>[] = [
    {
      key: "name",
      title: "Name",
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
      title: "Plan",
      width: "100px",
      badge: (_, record) => ({
        label: record.plan.toUpperCase(),
        variant: record.plan === "enterprise" ? "default" : "secondary",
      }),
    },
    {
      key: "isActive",
      title: "Status",
      width: "100px",
      badge: (_, record) => ({
        label: record.isActive ? "Active" : "Inactive",
        variant: record.isActive ? "default" : "secondary",
      }),
    },
    {
      key: "_count",
      title: "Fields",
      width: "80px",
      render: (_, record) => record._count?.fields || 0,
    },
    {
      key: "_count",
      title: "Users",
      width: "80px",
      render: (_, record) => record._count?.users || 0,
    },
    {
      key: "createdAt",
      title: "Created",
      width: "120px",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  const actions: TableAction<Tenant>[] = [
    {
      label: "View",
      onClick: (record) => router.push(`/system/organizations/${record.id}`),
    },
    {
      label: "Edit",
      onClick: (record) =>
        router.push(`/system/organizations/${record.id}/edit`),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">
            Manage all platform organizations, view stats, and configure plans.
          </p>
        </div>
        <Link href="/system/organizations/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Organization
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <ScrollableTable
        data={filteredData || []}
        columns={columns}
        actions={actions}
        loading={isLoading}
        error={error?.message}
        pagination={data?.pagination}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
        emptyMessage="No organizations found"
      />
    </div>
  );
}
