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
import { useUser } from "@/hooks/useUser";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roles: Array<{ name: string; isActive: boolean }>;
  createdAt: Date;
};

export default function StaffPage() {
  const router = useRouter();
  const { isTenantAdmin } = useUser();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const { data, isLoading, error } = trpc.user.getStaff.useQuery({
    page,
    limit,
    search: search || undefined,
  });

  const columns: TableColumn<StaffMember>[] = [
    {
      key: "name",
      title: "Nombre",
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
      title: "Teléfono",
      width: "140px",
      render: (value) => value || "-",
    },
    {
      key: "roles",
      title: "Roles",
      width: "200px",
      render: (_, record) => (
        <div className="flex gap-1 flex-wrap">
          {record.roles
            .filter((r) => r.isActive)
            .map((role) => (
              <Badge key={role.name} variant="secondary">
                {role.name}
              </Badge>
            ))}
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Añadido",
      width: "130px",
      render: (value) =>
        new Date(value as Date).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  const actions: TableAction<StaffMember>[] = [
    {
      label: "Ver detalles",
      onClick: (record) => router.push(`/dashboard/staff/${record.id}`),
    },
  ];

  if (!isTenantAdmin) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta sección
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personal</h1>
          <p className="text-muted-foreground">Gestiona el equipo de trabajo</p>
        </div>
        <Link href="/dashboard/staff/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Invitar Personal
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
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
        emptyMessage="No se encontró personal"
      />
    </div>
  );
}
