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
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  _count: {
    reservations: number;
  };
  createdAt: Date;
};

export default function ClientsPage() {
  const router = useRouter();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const { data, isLoading, error } = trpc.user.getClients.useQuery({
    page,
    limit,
    search: search || undefined,
  });

  const columns: TableColumn<Client>[] = [
    {
      key: "name",
      title: "Cliente",
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
      key: "_count",
      title: "Reservas",
      width: "100px",
      render: (_, record) => (
        <Badge variant="secondary">{record._count.reservations}</Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Registrado",
      width: "130px",
      render: (value) =>
        new Date(value as Date).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  const actions: TableAction<Client>[] = [
    {
      label: "Ver perfil",
      onClick: (record) => router.push(`/dashboard/clients/${record.id}`),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona los clientes y su historial de reservas
          </p>
        </div>
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
        emptyMessage="No se encontraron clientes"
      />
    </div>
  );
}
