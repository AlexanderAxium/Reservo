"use client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import {
  Edit,
  Eye,
  MapPin,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function OwnerFieldsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<string | undefined>(undefined);
  const [availableFilter, setAvailableFilter] = useState<boolean | undefined>(
    undefined
  );
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);

  const { data, isLoading, refetch } = trpc.field.getAll.useQuery({
    page,
    limit: 10,
    search: search || undefined,
    sport: sportFilter as
      | "FOOTBALL"
      | "TENNIS"
      | "BASKETBALL"
      | "VOLLEYBALL"
      | "FUTSAL"
      | undefined,
    available: availableFilter,
  });

  const deleteMutation = trpc.field.delete.useMutation({
    onSuccess: () => {
      toast.success("Cancha eliminada correctamente");
      setDeleteFieldId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo eliminar la cancha");
    },
  });

  const updateAvailabilityMutation = trpc.field.updateAvailability.useMutation({
    onSuccess: () => {
      toast.success("Disponibilidad actualizada correctamente");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo actualizar la disponibilidad");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const handleToggleAvailability = (
    id: string,
    currentAvailability: boolean
  ) => {
    updateAvailabilityMutation.mutate({
      id,
      available: !currentAvailability,
    });
  };

  const sportLabels: Record<string, string> = {
    FOOTBALL: "Fútbol",
    TENNIS: "Tenis",
    BASKETBALL: "Básquet",
    VOLLEYBALL: "Vóley",
    FUTSAL: "Futsal",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Mis Canchas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestiona todas tus canchas deportivas
          </p>
        </div>
        <Link href="/dashboard/owner/fields/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cancha
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="search-field"
                className="text-sm font-medium mb-2 block"
              >
                Búsqueda
              </label>
              <input
                id="search-field"
                type="text"
                placeholder="Buscar por nombre, dirección..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="sport-filter"
                className="text-sm font-medium mb-2 block"
              >
                Deporte
              </label>
              <select
                id="sport-filter"
                value={sportFilter || ""}
                onChange={(e) => {
                  setSportFilter(e.target.value || undefined);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Todos</option>
                <option value="FOOTBALL">Fútbol</option>
                <option value="TENNIS">Tenis</option>
                <option value="BASKETBALL">Básquet</option>
                <option value="VOLLEYBALL">Vóley</option>
                <option value="FUTSAL">Futsal</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="availability-filter"
                className="text-sm font-medium mb-2 block"
              >
                Disponibilidad
              </label>
              <select
                id="availability-filter"
                value={
                  availableFilter === undefined
                    ? ""
                    : availableFilter.toString()
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setAvailableFilter(
                    value === "" ? undefined : value === "true"
                  );
                  setPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Todas</option>
                <option value="true">Disponibles</option>
                <option value="false">No disponibles</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Canchas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Canchas</CardTitle>
          <CardDescription>
            {data?.pagination.total || 0} cancha(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando canchas...</div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No se encontraron canchas
              </p>
              <Link href="/dashboard/owner/fields/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Cancha
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Deporte</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Disponibilidad</TableHead>
                      <TableHead>Reservas</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">
                          {field.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {sportLabels[field.sport] || field.sport}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">
                            {field.address}
                            {field.district && (
                              <span className="text-muted-foreground">
                                {" "}
                                • {field.district}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            S/ {formatPrice(field.price)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleToggleAvailability(
                                field.id,
                                field.available
                              )
                            }
                            disabled={updateAvailabilityMutation.isPending}
                          >
                            {field.available ? (
                              <>
                                <ToggleRight className="mr-2 h-4 w-4 text-green-600" />
                                <span className="text-green-600">
                                  Disponible
                                </span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4 text-red-600" />
                                <span className="text-red-600">
                                  No disponible
                                </span>
                              </>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {field._count?.reservations || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/dashboard/owner/fields/${field.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link
                              href={`/dashboard/owner/fields/${field.id}/edit`}
                            >
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteFieldId(field.id)}
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
                    {data.pagination.totalPages}
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

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog
        open={deleteFieldId !== null}
        onOpenChange={(open) => !open && setDeleteFieldId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cancha?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La cancha será eliminada
              permanentemente junto con todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFieldId && handleDelete(deleteFieldId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
