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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeatureIcon } from "@/lib/feature-icons";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import {
  Edit,
  Eye,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type ViewMode = "list" | "grid";

export default function AdminFieldsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<string | undefined>(undefined);
  const [availableFilter, setAvailableFilter] = useState<boolean | undefined>(
    undefined
  );
  const [ownerFilter, setOwnerFilter] = useState<string | undefined>(undefined);
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const { data, isLoading, refetch } = trpc.field.getAll.useQuery({
    page,
    limit: 20,
    search: search && search.trim() !== "" ? search.trim() : undefined,
    sport: sportFilter as
      | "FOOTBALL"
      | "TENNIS"
      | "BASKETBALL"
      | "VOLLEYBALL"
      | "FUTSAL"
      | undefined,
    available: availableFilter,
    ownerId: ownerFilter && ownerFilter !== "" ? ownerFilter : undefined,
  });

  // Los owners se extraerán de las canchas mostradas

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

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const sportLabels: Record<string, string> = {
    FOOTBALL: "Fútbol",
    TENNIS: "Tenis",
    BASKETBALL: "Básquet",
    VOLLEYBALL: "Vóley",
    FUTSAL: "Futsal",
  };

  // Extraer owners únicos de las canchas
  const uniqueOwners = new Map<
    string,
    { id: string; name: string; email: string }
  >();
  data?.data.forEach((field) => {
    if (field.owner && !uniqueOwners.has(field.owner.id)) {
      uniqueOwners.set(field.owner.id, {
        id: field.owner.id,
        name: field.owner.name,
        email: field.owner.email,
      });
    }
  });

  // Imagen por defecto
  const defaultImageUrl =
    "https://images.unsplash.com/photo-1575361204480-05e88e6e8b1f?w=800";

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Gestión de Canchas
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Administra todas las canchas del sistema
            </p>
          </div>
          <Link href="/dashboard/admin/fields/new">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="admin-search-field"
                  className="text-sm font-medium mb-2 block"
                >
                  Búsqueda
                </label>
                <input
                  id="admin-search-field"
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
                  htmlFor="admin-sport-filter"
                  className="text-sm font-medium mb-2 block"
                >
                  Deporte
                </label>
                <Select
                  value={sportFilter || "all"}
                  onValueChange={(value) => {
                    setSportFilter(value === "all" ? undefined : value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="admin-sport-filter">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="FOOTBALL">Fútbol</SelectItem>
                    <SelectItem value="TENNIS">Tenis</SelectItem>
                    <SelectItem value="BASKETBALL">Básquet</SelectItem>
                    <SelectItem value="VOLLEYBALL">Vóley</SelectItem>
                    <SelectItem value="FUTSAL">Futsal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="admin-availability-filter"
                  className="text-sm font-medium mb-2 block"
                >
                  Disponibilidad
                </label>
                <Select
                  value={
                    availableFilter === undefined
                      ? "all"
                      : availableFilter.toString()
                  }
                  onValueChange={(value) => {
                    setAvailableFilter(
                      value === "all" ? undefined : value === "true"
                    );
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="admin-availability-filter">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="true">Disponibles</SelectItem>
                    <SelectItem value="false">No disponibles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="admin-owner-filter"
                  className="text-sm font-medium mb-2 block"
                >
                  Dueño
                </label>
                <Select
                  value={ownerFilter || "all"}
                  onValueChange={(value) => {
                    setOwnerFilter(
                      value === "all" || value === "" ? undefined : value
                    );
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="admin-owner-filter">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los dueños</SelectItem>
                    {Array.from(uniqueOwners.values()).map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Canchas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Canchas</CardTitle>
                <CardDescription>
                  {data?.pagination.total || 0} cancha(s) encontrada(s) en el
                  sistema
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
              </div>
            ) : viewMode === "grid" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.data.map((field) => (
                    <Card
                      key={field.id}
                      className="overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[4/3] w-full">
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
                        {field.fieldFeatures &&
                          field.fieldFeatures.length > 0 && (
                            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1 px-2 pb-2 pt-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                              {field.fieldFeatures.slice(0, 3).map((ff) => (
                                <Badge
                                  key={ff.id}
                                  variant="secondary"
                                  className="gap-1 px-2 py-0.5 text-[10px] bg-black/60 text-white border-white/10"
                                >
                                  <FeatureIcon
                                    iconName={ff.feature.icon}
                                    className="h-3 w-3"
                                  />
                                  <span className="truncate max-w-[80px]">
                                    {ff.feature.name}
                                  </span>
                                </Badge>
                              ))}
                              {field.fieldFeatures.length > 3 && (
                                <Badge
                                  variant="secondary"
                                  className="px-2 py-0.5 text-[10px] bg-black/60 text-white border-white/10"
                                >
                                  +{field.fieldFeatures.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base truncate">
                          {field.name}
                        </CardTitle>
                        <div className="mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">
                              {field.address}
                              {field.district && ` • ${field.district}`}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-1 pb-3">
                        <div className="flex items-center justify-between text-sm">
                          <Badge variant="outline">
                            {sportLabels[field.sport] || field.sport}
                          </Badge>
                          <span className="font-semibold text-base">
                            S/ {formatPrice(field.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {field.owner?.name || "N/A"}
                            </span>
                          </div>
                          <Badge
                            variant={field.available ? "default" : "secondary"}
                          >
                            {field.available ? "Disponible" : "No disponible"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Reservas: {field._count?.reservations || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Link
                            href={`/dashboard/admin/fields/${field.id}`}
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
                            href={`/dashboard/admin/fields/${field.id}/edit`}
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
                        <TableHead>Dueño</TableHead>
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
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">
                                  {field.owner?.name || "N/A"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {field.owner?.email || ""}
                                </p>
                              </div>
                            </div>
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
                            <Badge
                              variant={
                                field.available ? "default" : "secondary"
                              }
                            >
                              {field.available ? "Disponible" : "No disponible"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {field._count?.reservations || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/dashboard/admin/fields/${field.id}`}
                              >
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link
                                href={`/dashboard/admin/fields/${field.id}/edit`}
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
                      {data.pagination.totalPages} • Total:{" "}
                      {data.pagination.total} canchas
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
                permanentemente junto con todos sus datos asociados (reservas,
                horarios, etc.).
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
    </ProtectedRoute>
  );
}
