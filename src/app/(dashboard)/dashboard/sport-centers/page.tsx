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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type SportCenter = {
  id: string;
  name: string;
  address: string;
  district?: string | null;
  city: string | null;
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
  createdAt: string;
};

export default function SportCentersPage() {
  const { t } = useTranslation("dashboard");
  const router = useRouter();
  const { hasPermission } = useRBAC();
  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  if (!hasPermission(PermissionAction.READ, PermissionResource.SPORT_CENTER)) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noPermissionSection")}</p>
        </div>
      </div>
    );
  }

  const { data, isLoading, error, refetch } = trpc.sportCenter.list.useQuery({
    page,
    limit,
    search: search || undefined,
  });

  const deleteMutation = trpc.sportCenter.delete.useMutation({
    onSuccess: () => {
      toast.success(t("sportCentersList.centerDeleted"));
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || t("sportCentersList.deleteError"));
    },
  });

  const columns: TableColumn<SportCenter>[] = [
    {
      key: "name",
      title: t("sportCentersList.nameCol"),
      width: "200px",
      render: (_, record) => (
        <div>
          <p className="font-medium">{record.name}</p>
          <p className="text-xs text-muted-foreground">
            {[record.district, record.city].filter(Boolean).join(", ") || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "address",
      title: t("sportCentersList.addressCol"),
      width: "250px",
    },
    {
      key: "owner",
      title: t("sportCentersList.ownerCol"),
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
      title: t("sportCentersList.fieldsCol"),
      width: "80px",
      render: (_, record) => record._count.fields,
    },
    {
      key: "phone",
      title: t("sportCentersList.phoneCol"),
      width: "120px",
      render: (value) => (value != null && value !== "" ? String(value) : "-"),
    },
    {
      key: "createdAt",
      title: t("sportCentersList.createdCol"),
      width: "120px",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  const actions: TableAction<SportCenter>[] = [
    {
      label: t("sportCentersList.viewDetails"),
      onClick: (record) => router.push(`/dashboard/sport-centers/${record.id}`),
    },
    {
      label: t("sportCentersList.editAction"),
      onClick: (record) =>
        router.push(`/dashboard/sport-centers/${record.id}/edit`),
    },
    {
      separator: true,
      label: t("sportCentersList.deleteAction"),
      variant: "destructive",
      onClick: (record) =>
        setDeleteTarget({ id: record.id, name: record.name }),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("sportCentersList.title")}</h1>
          <p className="text-muted-foreground">
            {t("sportCentersList.description")}
          </p>
        </div>
        <Link href="/dashboard/sport-centers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("sportCentersList.newCenter")}
          </Button>
        </Link>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("sportCentersList.searchPlaceholder")}
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
        emptyMessage={t("sportCentersList.noSportCenters")}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("sportCentersList.deleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("sportCentersList.deleteDesc")}
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
