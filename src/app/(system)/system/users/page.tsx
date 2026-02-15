"use client";

import { Badge } from "@/components/ui/badge";
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
import { Search } from "lucide-react";
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
  createdAt: Date;
};

export default function Users() {
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

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      title: "Name",
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
      title: "Primary Role",
      width: "150px",
      render: (_, record) => {
        const roles = record.userRoles?.map((ur) => ur.role) ?? [];
        const activeRole = roles.find((r) => r.isActive) ?? roles[0];
        return activeRole ? (
          <Badge variant="secondary">
            {activeRole.displayName ?? activeRole.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground">No role</span>
        );
      },
    },
    {
      key: "tenant",
      title: "Organization",
      width: "200px",
      render: (_, record) =>
        record.tenant?.name || <span className="text-muted-foreground">-</span>,
    },
    {
      key: "createdAt",
      title: "Joined",
      width: "120px",
      render: (value) => new Date(value as Date).toLocaleDateString(),
    },
  ];

  const actions: TableAction<User>[] = [
    {
      label: "View Details",
      onClick: (record) => router.push(`/system/users/${record.id}`),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage all users across the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="sys_admin">System Admin</SelectItem>
            <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
            <SelectItem value="tenant_staff">Tenant Staff</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <ScrollableTable
        data={data?.data || []}
        columns={columns}
        actions={actions}
        loading={isLoading}
        error={error?.message}
        pagination={data?.pagination}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
        emptyMessage="No users found"
      />
    </div>
  );
}
