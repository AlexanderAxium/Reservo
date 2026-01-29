"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema único del formulario (crear y editar) para que el resolver y useForm compartan tipos
const featureFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

type FeatureFormData = z.input<typeof featureFormSchema>;

export default function AdminFeaturesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<{
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    isActive: boolean;
  } | null>(null);
  const [deleteFeatureId, setDeleteFeatureId] = useState<string | null>(null);

  const { data, isLoading, refetch } = trpc.feature.getAll.useQuery({
    page,
    limit: 20,
    search: search || undefined,
  });

  const form = useForm<FeatureFormData>({
    resolver: zodResolver(featureFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      isActive: true,
    },
  });

  // Reset form when editing
  useState(() => {
    if (editingFeature) {
      form.reset({
        name: editingFeature.name,
        description: editingFeature.description || "",
        icon: editingFeature.icon || "",
        isActive: editingFeature.isActive,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        icon: "",
        isActive: true,
      });
    }
  });

  const createFeature = trpc.feature.create.useMutation({
    onSuccess: () => {
      toast.success("Característica creada correctamente");
      setIsDialogOpen(false);
      setEditingFeature(null);
      form.reset();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo crear la característica");
    },
  });

  const updateFeature = trpc.feature.update.useMutation({
    onSuccess: () => {
      toast.success("Característica actualizada correctamente");
      setIsDialogOpen(false);
      setEditingFeature(null);
      form.reset();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo actualizar la característica");
    },
  });

  const deleteFeature = trpc.feature.delete.useMutation({
    onSuccess: () => {
      toast.success("Característica eliminada correctamente");
      setDeleteFeatureId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo eliminar la característica");
    },
  });

  const handleCreate = () => {
    setEditingFeature(null);
    form.reset({
      name: "",
      description: "",
      icon: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (feature: {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    isActive: boolean;
  }) => {
    setEditingFeature(feature);
    form.reset({
      name: feature.name,
      description: feature.description || "",
      icon: feature.icon || "",
      isActive: feature.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: FeatureFormData) => {
    if (editingFeature) {
      updateFeature.mutate({
        id: editingFeature.id,
        ...data,
      });
    } else {
      createFeature.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    deleteFeature.mutate({ id });
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Gestión de Características
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Administra las características disponibles para las canchas
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Característica
          </Button>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="Buscar por nombre, descripción..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md"
            />
          </CardContent>
        </Card>

        {/* Tabla de Características */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Características</CardTitle>
            <CardDescription>
              {data?.pagination.total || 0} característica(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                Cargando características...
              </div>
            ) : !data?.data || data.data.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No se encontraron características
                </p>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Característica
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Icono</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.map((feature) => (
                        <TableRow key={feature.id}>
                          <TableCell className="font-medium">
                            {feature.name}
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground max-w-md truncate">
                              {feature.description || "Sin descripción"}
                            </p>
                          </TableCell>
                          <TableCell>
                            {feature.icon ? (
                              <span className="text-sm">{feature.icon}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Sin icono
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                feature.isActive ? "default" : "secondary"
                              }
                            >
                              {feature.isActive ? "Activa" : "Inactiva"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(feature)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteFeatureId(feature.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginación */}
                {data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Página {data.pagination.page} de{" "}
                      {data.pagination.totalPages} • Total:{" "}
                      {data.pagination.total} características
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={!data.pagination.hasPrev || isLoading}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!data.pagination.hasNext || isLoading}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Dialog de creación/edición */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFeature
                  ? "Editar Característica"
                  : "Nueva Característica"}
              </DialogTitle>
              <DialogDescription>
                {editingFeature
                  ? "Modifica la información de la característica"
                  : "Crea una nueva característica para las canchas"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Duchas, WiFi, Estacionamiento"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe la característica..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icono</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 🚿, wifi, car" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Activa</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          La característica estará disponible para seleccionar
                        </p>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingFeature(null);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createFeature.isPending || updateFeature.isPending
                    }
                  >
                    {editingFeature ? "Guardar" : "Crear"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmación de eliminación */}
        <AlertDialog
          open={deleteFeatureId !== null}
          onOpenChange={(open) => !open && setDeleteFeatureId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar característica?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. La característica será
                eliminada permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteFeatureId && handleDelete(deleteFeatureId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  );
}
