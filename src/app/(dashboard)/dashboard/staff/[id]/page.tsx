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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { ArrowLeft, Calendar, Mail, Phone, Plus, User, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function StaffDetailPage() {
  const params = useParams();
  const staffId = params.id as string;
  const { t } = useTranslation("dashboard");
  const { hasPermission } = useRBAC();
  const canUpdateRole = hasPermission(
    PermissionAction.UPDATE,
    PermissionResource.ROLE
  );

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [removeRoleDialog, setRemoveRoleDialog] = useState<{
    open: boolean;
    roleId: string;
    roleName: string;
  }>({ open: false, roleId: "", roleName: "" });

  const utils = trpc.useUtils();

  const { data: staff, isLoading } = trpc.user.getById.useQuery({
    id: staffId,
  });

  const { data: allRoles } = trpc.rbac.getRoles.useQuery(undefined, {
    enabled: canUpdateRole,
  });

  const availableRoles = useMemo(() => {
    if (!allRoles || !staff?.roles) return [];
    const assignedIds = new Set(staff.roles.map((r) => r.id));
    return allRoles.filter((r) => !assignedIds.has(r.id) && r.isActive);
  }, [allRoles, staff?.roles]);

  const assignRole = trpc.rbac.assignRole.useMutation({
    onSuccess: () => {
      toast.success(t("staffDetail.roleAssigned"));
      utils.user.getById.invalidate({ id: staffId });
      setAssignDialogOpen(false);
      setSelectedRoleId("");
    },
    onError: (err) => {
      toast.error(err.message || t("staffDetail.assignError"));
    },
  });

  const removeRole = trpc.rbac.removeRole.useMutation({
    onSuccess: () => {
      toast.success(t("staffDetail.roleRemoved"));
      utils.user.getById.invalidate({ id: staffId });
    },
    onError: (err) => {
      toast.error(err.message || t("staffDetail.removeError"));
    },
  });

  const handleAssignRole = () => {
    if (!selectedRoleId) {
      toast.error(t("staffDetail.selectRoleError"));
      return;
    }
    assignRole.mutate({
      userId: staffId,
      roleId: selectedRoleId,
    });
  };

  const handleRemoveRole = () => {
    removeRole.mutate({
      userId: staffId,
      roleId: removeRoleDialog.roleId,
    });
    setRemoveRoleDialog({ open: false, roleId: "", roleName: "" });
  };

  if (!hasPermission(PermissionAction.READ, PermissionResource.STAFF)) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noPermissionSection")}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center py-8 gap-3">
          <User className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">{t("staffDetail.notFound")}</p>
          <Link href="/dashboard/staff">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("staffDetail.back")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/staff">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("staffDetail.back")}
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {t("staffDetail.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("staffDetail.description")}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("staffDetail.personalInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("staffDetail.nameLabel")}
              </p>
              <p className="text-base">{staff.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("staffDetail.emailLabel")}
                </p>
                <p className="text-base">{staff.email}</p>
              </div>
            </div>
            {staff.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("staffDetail.phoneLabel")}
                  </p>
                  <p className="text-base">{staff.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("staffDetail.memberSince")}
                </p>
                <p className="text-base">
                  {new Date(staff.createdAt).toLocaleDateString("es-PE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("staffDetail.rolesAndPermissions")}</CardTitle>
            {canUpdateRole && (
              <Button
                size="sm"
                onClick={() => setAssignDialogOpen(true)}
                disabled={availableRoles.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("staffDetail.assignRole")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {staff.roles && staff.roles.length > 0 ? (
              staff.roles
                .filter((r) => r.isActive)
                .map((role) => (
                  <Badge
                    key={role.id}
                    variant="secondary"
                    className="flex items-center gap-1 text-sm py-1 px-3"
                  >
                    {role.displayName || role.name}
                    {canUpdateRole && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-5 w-5 rounded-full hover:bg-muted-foreground/20"
                        onClick={() =>
                          setRemoveRoleDialog({
                            open: true,
                            roleId: role.id,
                            roleName: role.displayName || role.name,
                          })
                        }
                        disabled={removeRole.isPending}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))
            ) : (
              <p className="text-muted-foreground">
                {t("staffDetail.noRolesAssigned")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("staffDetail.assignRoleTitle")}</DialogTitle>
            <DialogDescription>
              {t("staffDetail.assignRoleDesc")} <strong>{staff.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
                <SelectValue placeholder={t("staffDetail.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.displayName} ({role.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssignDialogOpen(false);
                setSelectedRoleId("");
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleAssignRole}
              disabled={!selectedRoleId || assignRole.isPending}
            >
              {assignRole.isPending
                ? t("staffDetail.assigning")
                : t("staffDetail.assign")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={removeRoleDialog.open}
        onOpenChange={(open) =>
          setRemoveRoleDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("staffDetail.removeRoleTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("staffDetail.removeRoleDesc", {
                name: removeRoleDialog.roleName,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveRole}>
              {t("staffDetail.remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
