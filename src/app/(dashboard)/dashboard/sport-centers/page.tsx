"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ScrollableTable,
  type TableAction,
  type TableColumn,
} from "@/components/ui/scrollable-table";
import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/hooks/useTRPC";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SportCenter = {
  id: string;
  name: string;
  address: string;
  district?: string | null;
  city: string;
  phone?: string | null;
  email?: string | null;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    fields: number;
  };
  createdAt: Date;
};

export default function SportCentersPage() {
  const router = useRouter();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const { data, isLoading, error, refetch } = trpc.sportCenter.list.useQuery({
    page,
    limit,
    search: search || undefined,
  });

  const deleteMutation = trpc.sportCenter.delete.useMutation({
    onSuccess: () => {
      toast.success("Centro deportivo eliminado correctamente");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar centro deportivo");
    },
  });

  const columns: TableColumn<SportCenter>[] = [
    {
      key: "name",
      title: "Nombre",
      width: "200px",
      render: (_, record) => (
        <div>
          <p className="font-medium">{record.name}</p>
          <p className="text-xs text-muted-foreground">
            {record.district}, {record.city}
          </p>
        </div>
      ),
    },
    {
      key: "address",
      title: "Dirección",
      width: "250px",
    },
    {
      key: "owner",
      title: "Propietario",
      width: "180px",
      render: (_, record) => (
        <div>
          <p className="font-medium text-sm">{record.owner.name}</p>
          <p className="text-xs text-muted-foreground">{record.owner.email}</p>
        </div>
      ),
    },
    {
      key: "_count",
      title: "Canchas",
      width: "80px",
      render: (_, record) => record._count.fields,
    },
    {
      key: "phone",
      title: "Teléfono",
      width: "120px",
      render: (value) => value || "-",
    },
    {
      key: "createdAt",
      title: "Creado",
      width: "120px",
      render: (value) => new Date(value as Date).toLocaleDateString(),
    },
  ];

  const actions: TableAction<SportCenter>[] = [
    {
      label: "Ver detalles",
      onClick: (record) => router.push(`/dashboard/sport-centers/${record.id}`),
    },
    {
      label: "Editar",
      onClick: (record) =>
        router.push(`/dashboard/sport-centers/${record.id}/edit`),
    },
    {
      separator: true,
      label: "Eliminar",
      variant: "destructive",
      onClick: (record) => {
        if (
          confirm(
            `¿Estás seguro de eliminar el centro deportivo "${record.name}"?`
          )
        ) {
          deleteMutation.mutate({ id: record.id });
        }
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Centros Deportivos</h1>
          <p className="text-muted-foreground">
            Gestiona las ubicaciones de tus centros deportivos.
          </p>
        </div>
        <Link href="/dashboard/sport-centers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Centro
          </Button>
        </Link>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar centros deportivos..."
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
        emptyMessage="No se encontraron centros deportivos"
      />
    </div>
  );
}
