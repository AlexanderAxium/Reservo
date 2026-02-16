"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ScrollableTable,
  type TableAction,
  type TableColumn,
} from "@/components/ui/scrollable-table";
import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/hooks/useTRPC";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Feature = {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  isActive: boolean;
  createdAt: string;
};

export default function FeaturesPage() {
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 50,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const { data, isLoading, error, refetch } = trpc.feature.getAll.useQuery({
    page,
    limit,
    search: search || undefined,
  });

  const createMutation = trpc.feature.create.useMutation({
    onSuccess: () => {
      toast.success("Característica creada correctamente");
      setShowCreateForm(false);
      setFormData({ name: "", description: "", icon: "" });
      refetch();
    },
    onError: (error) =>
      toast.error(error.message || "Error al crear característica"),
  });

  const updateMutation = trpc.feature.update.useMutation({
    onSuccess: () => {
      toast.success("Característica actualizada correctamente");
      setEditingFeature(null);
      setFormData({ name: "", description: "", icon: "" });
      refetch();
    },
    onError: (error) =>
      toast.error(error.message || "Error al actualizar característica"),
  });

  const deleteMutation = trpc.feature.delete.useMutation({
    onSuccess: () => {
      toast.success("Característica eliminada correctamente");
      refetch();
    },
    onError: (error) =>
      toast.error(error.message || "Error al eliminar característica"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFeature) {
      updateMutation.mutate({ id: editingFeature.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      name: feature.name,
      description: feature.description || "",
      icon: feature.icon || "",
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingFeature(null);
    setShowCreateForm(false);
    setFormData({ name: "", description: "", icon: "" });
  };

  const columns: TableColumn<Feature>[] = [
    {
      key: "name",
      title: "Nombre",
      width: "200px",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {record.icon && <span>{record.icon}</span>}
          <span className="font-medium">{record.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      title: "Descripción",
      width: "300px",
      render: (value) => (value != null && value !== "" ? String(value) : "-"),
    },
    {
      key: "isActive",
      title: "Estado",
      width: "100px",
      badge: (_, record) => ({
        label: record.isActive ? "Activa" : "Inactiva",
        variant: record.isActive ? "default" : "secondary",
      }),
    },
    {
      key: "createdAt",
      title: "Creado",
      width: "120px",
      render: (value) => new Date(value as Date).toLocaleDateString(),
    },
  ];

  const actions: TableAction<Feature>[] = [
    {
      label: "Editar",
      onClick: (record) => startEdit(record),
    },
    {
      separator: true,
      label: "Eliminar",
      variant: "destructive",
      onClick: (record) => {
        if (
          confirm(
            `¿Estás seguro de eliminar la característica "${record.name}"?`
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
          <h1 className="text-2xl font-bold">Características</h1>
          <p className="text-muted-foreground">
            Gestiona las características disponibles para las canchas
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Característica
        </Button>
      </div>

      {showCreateForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingFeature ? "Editar" : "Nueva"} Característica
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: Vestuarios"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icono (emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="🏋️"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descripción opcional"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Guardando..."
                  : editingFeature
                    ? "Actualizar"
                    : "Crear"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar características..."
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
        emptyMessage="No se encontraron características"
      />
    </div>
  );
}
