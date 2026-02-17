"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

const ACTION_ORDER = ["CREATE", "READ", "UPDATE", "DELETE", "MANAGE"];

export default function RoleDetailPage() {
  const params = useParams();
  const roleId = params.id as string;
  const { t } = useTranslation("dashboard");
  const { hasPermission } = useRBAC();
  const canReadRole = hasPermission(
    PermissionAction.READ,
    PermissionResource.ROLE
  );
  const canUpdateRole = hasPermission(
    PermissionAction.UPDATE,
    PermissionResource.ROLE
  );

  const utils = trpc.useUtils();

  const { data: rolesData, isLoading: rolesLoading } =
    trpc.rbac.getAllRoles.useQuery();

  const role = useMemo(
    () => rolesData?.data?.find((r) => r.id === roleId),
    [rolesData, roleId]
  );

  const { data: rolePermissions, isLoading: permissionsLoading } =
    trpc.rbac.getRolePermissions.useQuery({ roleId });

  const { data: allPermissions, isLoading: allPermsLoading } =
    trpc.rbac.getAllPermissions.useQuery();

  const assignPermission = trpc.rbac.assignPermissionToRole.useMutation({
    onSuccess: () => {
      utils.rbac.getRolePermissions.invalidate({ roleId });
      utils.rbac.getAllRoles.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || t("roleDetail.assignError"));
    },
  });

  const removePermission = trpc.rbac.removePermissionFromRole.useMutation({
    onSuccess: () => {
      utils.rbac.getRolePermissions.invalidate({ roleId });
      utils.rbac.getAllRoles.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || t("roleDetail.removeError"));
    },
  });

  const assignedPermissionIds = useMemo(() => {
    if (!rolePermissions) return new Set<string>();
    return new Set(rolePermissions.map((rp) => rp.permission.id));
  }, [rolePermissions]);

  const permissionGrid = useMemo(() => {
    if (!allPermissions?.data) return {};
    const grid: Record<
      string,
      Record<string, { id: string; assigned: boolean }>
    > = {};

    for (const perm of allPermissions.data) {
      if (!grid[perm.resource]) {
        grid[perm.resource] = {};
      }
      const resourceRow = grid[perm.resource];
      if (resourceRow) {
        resourceRow[perm.action] = {
          id: perm.id,
          assigned: assignedPermissionIds.has(perm.id),
        };
      }
    }
    return grid;
  }, [allPermissions, assignedPermissionIds]);

  const resources = useMemo(
    () => Object.keys(permissionGrid).sort(),
    [permissionGrid]
  );

  const handleTogglePermission = useCallback(
    (permissionId: string, isAssigned: boolean) => {
      if (isAssigned) {
        removePermission.mutate({ roleId, permissionId });
      } else {
        assignPermission.mutate({ roleId, permissionId });
      }
    },
    [roleId, assignPermission, removePermission]
  );

  if (!canReadRole) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noPermissionSection")}</p>
        </div>
      </div>
    );
  }

  const isLoading = rolesLoading || permissionsLoading || allPermsLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("roleDetail.notFound")}</p>
          <Link href="/dashboard/staff">
            <Button variant="link" className="mt-2">
              {t("roleDetail.backToTeam")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={role.displayName}
        description={
          role.description || `${t("roleDetail.identifier")}: ${role.name}`
        }
        backHref="/dashboard/staff"
        actions={
          <div className="flex items-center gap-2">
            {role.isSystem && (
              <Badge variant="outline">{t("roleDetail.systemBadge")}</Badge>
            )}
            {role.isActive ? (
              <Badge variant="soft" className="text-emerald-600">
                {t("roleDetail.activeBadge")}
              </Badge>
            ) : (
              <Badge variant="soft" className="text-red-600">
                {t("roleDetail.inactiveBadge")}
              </Badge>
            )}
            {canUpdateRole && (
              <Link href={`/dashboard/roles/${roleId}/edit`}>
                <Button variant="outline">
                  <Pencil className="h-4 w-4 mr-2" />
                  {t("roleDetail.editRole")}
                </Button>
              </Link>
            )}
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("roleDetail.roleInfo")}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">
                {t("roleDetail.identifier")}
              </dt>
              <dd className="font-medium">{role.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">
                {t("roleDetail.displayNameLabel")}
              </dt>
              <dd className="font-medium">{role.displayName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">
                {t("roleDetail.descriptionLabel")}
              </dt>
              <dd className="font-medium">{role.description || "-"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">
                {t("roleDetail.typeLabel")}
              </dt>
              <dd className="font-medium">
                {role.isSystem
                  ? t("roleDetail.systemRole")
                  : t("roleDetail.customRole")}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("roleDetail.permissionsTitle")}</CardTitle>
          <CardDescription>
            {canUpdateRole
              ? t("roleDetail.permissionsGridDesc")
              : t("roleDetail.currentlyAssigned")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t("roleDetail.noPermissionsAvailable")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("roleDetail.resourceCol")}</TableHead>
                    {ACTION_ORDER.map((action) => (
                      <TableHead key={action} className="text-center">
                        {t(`staffPermissions.actions.${action}`)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource}>
                      <TableCell className="font-medium">
                        {t(`staffPermissions.resources.${resource}`)}
                      </TableCell>
                      {ACTION_ORDER.map((action) => {
                        const cell = permissionGrid[resource]?.[action];
                        if (!cell) {
                          return (
                            <TableCell key={action} className="text-center">
                              <span className="text-muted-foreground/40">
                                -
                              </span>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={action} className="text-center">
                            <Checkbox
                              checked={cell.assigned}
                              disabled={
                                !canUpdateRole ||
                                assignPermission.isPending ||
                                removePermission.isPending
                              }
                              onCheckedChange={() =>
                                handleTogglePermission(cell.id, cell.assigned)
                              }
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
