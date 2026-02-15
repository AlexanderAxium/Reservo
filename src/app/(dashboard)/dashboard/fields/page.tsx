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
import { trpc } from "@/hooks/useTRPC";
import { formatPrice } from "@/lib/utils";
import {
  Edit,
  Eye,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type ViewMode = "list" | "grid";

export default function FieldsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<string | undefined>(undefined);
  const [availableFilter, setAvailableFilter] = useState<boolean | undefined>(
    undefined
  );
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

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

  const defaultImageUrl =
    "https://images.unsplash.com/photo-1575361204480-05e88e6e8b1f?w=800";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Mis Canchas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestiona todas tus canchas deportivas
          </p>
        </div>
        <Link href="/dashboard/fields/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cancha
          </Button>
        </Link>
      </div>

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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Canchas</CardTitle>
              <CardDescription>
                {data?.pagination.total || 0} cancha(s) encontrada(s)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
              <Link href="/dashboard/fields/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Cancha
                </Button>
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.data.map((field) => (
                  <Card key={field.id} className="overflow-hidden">
                    <div className="relative aspect-video w-full">
                      <img
                        src={
                          field.images && field.images.length > 0
                            ? field.images[0]
                            : defaultImageUrl
                        }
                        alt={field.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = defaultImageUrl;
                        }}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{field.name}</CardTitle>
                      <div className="mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">
                            {field.address}
                            {field.district && ` • ${field.district}`}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {sportLabels[field.sport] || field.sport}
                        </Badge>
                        <span className="font-semibold text-lg">
                          S/ {formatPrice(field.price)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleAvailability(field.id, field.available)
                          }
                          disabled={updateAvailabilityMutation.isPending}
                          className="h-auto p-0"
                        >
                          {field.available ? (
                            <>
                              <ToggleRight className="mr-2 h-4 w-4 text-green-600" />
                              <span className="text-green-600">Disponible</span>
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
                        <Badge variant="secondary">
                          {field._count?.reservations || 0} reservas
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Link
                          href={`/dashboard/fields/${field.id}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/fields/${field.id}/edit`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteFieldId(field.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
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
                            <Link href={`/dashboard/fields/${field.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/dashboard/fields/${field.id}/edit`}>
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
