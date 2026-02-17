"use client";

import { FilterBar } from "@/components/dashboard/FilterBar";
import { PageHeader } from "@/components/dashboard/PageHeader";
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
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { Plus } from "lucide-react";
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
  const { t } = useTranslation("dashboard");
  const { hasPermission } = useRBAC();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 50,
  });

  if (!hasPermission(PermissionAction.READ, PermissionResource.FIELD)) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noPermissionSection")}</p>
        </div>
      </div>
    );
  }
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
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
      toast.success(t("featuresPage.featureCreated"));
      setShowCreateForm(false);
      setFormData({ name: "", description: "", icon: "" });
      refetch();
    },
    onError: (error) =>
      toast.error(error.message || t("featuresPage.createError")),
  });

  const updateMutation = trpc.feature.update.useMutation({
    onSuccess: () => {
      toast.success(t("featuresPage.featureUpdated"));
      setEditingFeature(null);
      setFormData({ name: "", description: "", icon: "" });
      refetch();
    },
    onError: (error) =>
      toast.error(error.message || t("featuresPage.updateError")),
  });

  const deleteMutation = trpc.feature.delete.useMutation({
    onSuccess: () => {
      toast.success(t("featuresPage.featureDeleted"));
      refetch();
    },
    onError: (error) =>
      toast.error(error.message || t("featuresPage.deleteError")),
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
      title: t("featuresPage.nameCol"),
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
      title: t("featuresPage.descriptionCol"),
      width: "300px",
      render: (value) => (value != null && value !== "" ? String(value) : "-"),
    },
    {
      key: "isActive",
      title: t("featuresPage.statusCol"),
      width: "100px",
      badge: (_, record) => ({
        label: record.isActive
          ? t("featuresPage.activeStatus")
          : t("featuresPage.inactiveStatus"),
        variant: record.isActive ? "default" : "secondary",
      }),
    },
    {
      key: "createdAt",
      title: t("featuresPage.createdCol"),
      width: "120px",
      render: (value) => new Date(value as Date).toLocaleDateString(),
    },
  ];

  const actions: TableAction<Feature>[] = [
    {
      label: t("featuresPage.editAction"),
      onClick: (record) => startEdit(record),
    },
    {
      separator: true,
      label: t("featuresPage.deleteAction"),
      variant: "destructive",
      onClick: (record) =>
        setDeleteTarget({ id: record.id, name: record.name }),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("featuresPage.title")}
        description={t("featuresPage.description")}
        actions={
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("featuresPage.newFeature")}
          </Button>
        }
      />

      {showCreateForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingFeature
              ? t("featuresPage.editFeatureTitle")
              : t("featuresPage.newFeatureTitle")}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("featuresPage.nameLabel")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("featuresPage.namePlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">{t("featuresPage.iconLabel")}</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder={t("featuresPage.iconPlaceholder")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                {t("featuresPage.descriptionLabel")}
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t("featuresPage.descriptionPlaceholder")}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={cancelEdit}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? t("featuresPage.saving")
                  : editingFeature
                    ? t("featuresPage.update")
                    : t("featuresPage.create")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("featuresPage.searchPlaceholder")}
      />

      <ScrollableTable
        data={data?.data || []}
        columns={columns}
        actions={actions}
        loading={isLoading}
        error={error?.message}
        pagination={data?.pagination}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
        emptyMessage={t("featuresPage.noFeatures")}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("featuresPage.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("featuresPage.deleteDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteTarget && deleteMutation.mutate({ id: deleteTarget.id })
              }
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
