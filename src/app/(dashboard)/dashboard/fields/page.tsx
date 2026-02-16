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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
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
  const { t } = useTranslation("dashboard");
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
      toast.success(t("fieldsList.fieldDeleted"));
      setDeleteFieldId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || t("fieldsList.fieldDeleteError"));
    },
  });

  const updateAvailabilityMutation = trpc.field.updateAvailability.useMutation({
    onSuccess: () => {
      toast.success(t("fieldsList.availabilityUpdated"));
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || t("fieldsList.availabilityUpdateError"));
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
    FOOTBALL: t("sports.FOOTBALL"),
    TENNIS: t("sports.TENNIS"),
    BASKETBALL: t("sports.BASKETBALL"),
    VOLLEYBALL: t("sports.VOLLEYBALL"),
    FUTSAL: t("sports.FUTSAL"),
  };

  const defaultImageUrl =
    "https://images.unsplash.com/photo-1575361204480-05e88e6e8b1f?w=800";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("fieldsList.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("fieldsList.description")}
          </p>
        </div>
        <Link href="/dashboard/fields/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("fieldsList.newField")}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("fieldsList.filters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search-field" className="mb-2">
                {t("fieldsList.search")}
              </Label>
              <Input
                id="search-field"
                type="text"
                placeholder={t("fieldsList.searchPlaceholder")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div>
              <Label htmlFor="sport-filter" className="mb-2">
                {t("fieldsList.sport")}
              </Label>
              <Select
                value={sportFilter ?? "__all__"}
                onValueChange={(val) => {
                  setSportFilter(val === "__all__" ? undefined : val);
                  setPage(1);
                }}
              >
                <SelectTrigger id="sport-filter">
                  <SelectValue placeholder={t("fieldsList.allSports")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">
                    {t("fieldsList.allSports")}
                  </SelectItem>
                  <SelectItem value="FOOTBALL">
                    {t("sports.FOOTBALL")}
                  </SelectItem>
                  <SelectItem value="TENNIS">{t("sports.TENNIS")}</SelectItem>
                  <SelectItem value="BASKETBALL">
                    {t("sports.BASKETBALL")}
                  </SelectItem>
                  <SelectItem value="VOLLEYBALL">
                    {t("sports.VOLLEYBALL")}
                  </SelectItem>
                  <SelectItem value="FUTSAL">{t("sports.FUTSAL")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="availability-filter" className="mb-2">
                {t("fieldsList.availability")}
              </Label>
              <Select
                value={
                  availableFilter === undefined
                    ? "__all__"
                    : availableFilter.toString()
                }
                onValueChange={(val) => {
                  setAvailableFilter(
                    val === "__all__" ? undefined : val === "true"
                  );
                  setPage(1);
                }}
              >
                <SelectTrigger id="availability-filter">
                  <SelectValue placeholder={t("fieldsList.allAvailability")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">
                    {t("fieldsList.allAvailability")}
                  </SelectItem>
                  <SelectItem value="true">
                    {t("fieldsList.available")}
                  </SelectItem>
                  <SelectItem value="false">
                    {t("fieldsList.unavailable")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("fieldsList.fieldList")}</CardTitle>
              <CardDescription>
                {t("fieldsList.fieldsFound", {
                  count: String(data?.pagination.total || 0),
                })}
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
            <div className="text-center py-8">
              {t("fieldsList.loadingFields")}
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {t("fieldsList.noFieldsFound")}
              </p>
              <Link href="/dashboard/fields/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("fieldsList.createFirst")}
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
                              <span className="text-green-600">
                                {t("fieldsList.availableStatus")}
                              </span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="mr-2 h-4 w-4 text-red-600" />
                              <span className="text-red-600">
                                {t("fieldsList.unavailableStatus")}
                              </span>
                            </>
                          )}
                        </Button>
                        <Badge variant="secondary">
                          {field._count?.reservations || 0}{" "}
                          {t("fieldsList.reservations")}
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
                            {t("fieldsList.view")}
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
                            {t("fieldsList.editBtn")}
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
                      <TableHead>{t("fieldsList.tableNameCol")}</TableHead>
                      <TableHead>{t("fieldsList.tableSportCol")}</TableHead>
                      <TableHead>{t("fieldsList.tableLocationCol")}</TableHead>
                      <TableHead>{t("fieldsList.tablePriceCol")}</TableHead>
                      <TableHead>{t("fieldsList.tableAvailCol")}</TableHead>
                      <TableHead>{t("fieldsList.tableResCol")}</TableHead>
                      <TableHead className="text-right">
                        {t("fieldsList.tableActionsCol")}
                      </TableHead>
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
                                  {t("fieldsList.availableStatus")}
                                </span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4 text-red-600" />
                                <span className="text-red-600">
                                  {t("fieldsList.unavailableStatus")}
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
                    {t("fieldsList.page", {
                      current: String(data.pagination.page),
                      total: String(data.pagination.totalPages),
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!data.pagination.hasPrev || isLoading}
                    >
                      {t("fieldsList.previous")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!data.pagination.hasNext || isLoading}
                    >
                      {t("fieldsList.next")}
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
            <AlertDialogTitle>{t("fieldsList.deleteField")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("fieldsList.deleteFieldDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFieldId && handleDelete(deleteFieldId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
