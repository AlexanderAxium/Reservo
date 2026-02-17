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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Plus, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type RoleRow = {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  rolePermissions?: Array<{ permission: { id: string } }>;
  createdAt: string;
};

export default function RolesPage() {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const { hasPermission } = useRBAC();
  const canReadRole = hasPermission(
    PermissionAction.READ,
    PermissionResource.ROLE
  );
  const canCreateRole = hasPermission(
    PermissionAction.CREATE,
    PermissionResource.ROLE
  );
  const canDeleteRole = hasPermission(
    PermissionAction.DELETE,
    PermissionResource.ROLE
  );

  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleRow | null>(null);

  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.rbac.getAllRoles.useQuery({
    page,
    limit,
    search: search || undefined,
  });

  const deleteRole = trpc.rbac.deleteRole.useMutation({
    onSuccess: () => {
      toast.success(t("rolesPage.roleDeleted"));
      utils.rbac.getAllRoles.invalidate();
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    },
    onError: (err) => {
      toast.error(err.message || t("rolesPage.roleDeleteError"));
    },
  });

  const filteredData = (data?.data || []).filter((role) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      role.name.toLowerCase().includes(q) ||
      role.displayName.toLowerCase().includes(q) ||
      (role.description?.toLowerCase().includes(q) ?? false)
    );
  });

  const columns: TableColumn<RoleRow>[] = [
    {
      key: "displayName",
      title: t("rolesPage.nameCol"),
      width: "200px",
      render: (_, record) => (
        <div>
          <p className="font-medium">{record.displayName}</p>
          <p className="text-xs text-muted-foreground">{record.name}</p>
        </div>
      ),
    },
    {
      key: "description",
      title: t("rolesPage.descriptionCol"),
      width: "250px",
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {value ? String(value) : "-"}
        </span>
      ),
    },
    {
      key: "isSystem",
      title: t("rolesPage.typeCol"),
      width: "100px",
      render: (_, record) =>
        record.isSystem ? (
          <Badge variant="outline">{t("rolesPage.systemType")}</Badge>
        ) : (
          <Badge variant="outline">{t("rolesPage.customType")}</Badge>
        ),
    },
    {
      key: "rolePermissions",
      title: t("rolesPage.permissionsCol"),
      width: "100px",
      render: (_, record) => (
        <span className="text-sm font-medium">
          {record.rolePermissions?.length ?? 0}
        </span>
      ),
    },
    {
      key: "isActive",
      title: t("rolesPage.statusCol"),
      width: "100px",
      render: (_, record) =>
        record.isActive ? (
          <Badge variant="soft" className="text-emerald-600">
            {t("rolesPage.activeStatus")}
          </Badge>
        ) : (
          <Badge variant="soft" className="text-red-600">
            {t("rolesPage.inactiveStatus")}
          </Badge>
        ),
    },
  ];

  const actions: TableAction<RoleRow>[] = [
    {
      label: t("rolesPage.viewDetails"),
      onClick: (record) => router.push(`/dashboard/roles/${record.id}`),
    },
    {
      label: t("rolesPage.editAction"),
      onClick: (record) => router.push(`/dashboard/roles/${record.id}/edit`),
    },
    ...(canDeleteRole
      ? [
          {
            label: t("rolesPage.deleteAction"),
            onClick: (record: RoleRow) => {
              if (record.isSystem) {
                toast.error(t("rolesPage.cannotDeleteSystem"));
                return;
              }
              setRoleToDelete(record);
              setDeleteDialogOpen(true);
            },
          },
        ]
      : []),
  ];

  if (!canReadRole) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noPermissionSection")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("rolesPage.title")}
        description={t("rolesPage.description")}
        actions={
          canCreateRole ? (
            <Link href="/dashboard/roles/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("rolesPage.createRole")}
              </Button>
            </Link>
          ) : undefined
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("rolesPage.searchPlaceholder")}
      />

      <ScrollableTable
        data={filteredData}
        columns={columns}
        actions={actions}
        loading={isLoading}
        error={error?.message}
        pagination={data?.pagination}
        onPageChange={setPage}
        onPageSizeChange={setLimit}
        emptyMessage={t("rolesPage.noRolesFound")}
        emptyIcon={<Shield className="h-12 w-12 text-muted-foreground" />}
        emptyAction={
          canCreateRole ? (
            <Link href="/dashboard/roles/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t("rolesPage.createRole")}
              </Button>
            </Link>
          ) : undefined
        }
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("rolesPage.deleteRoleTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("rolesPage.deleteRoleDesc", {
                name: roleToDelete?.displayName ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (roleToDelete) {
                  deleteRole.mutate({ id: roleToDelete.id });
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRole.isPending
                ? t("rolesPage.deleting")
                : t("rolesPage.deleteAction")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
