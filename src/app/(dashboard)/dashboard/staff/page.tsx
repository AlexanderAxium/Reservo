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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ScrollableTable,
  type TableAction,
  type TableColumn,
} from "@/components/ui/scrollable-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { usePagination } from "@/hooks/usePagination";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { KeyRound, Plus, Search, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roles: Array<{
    id: string;
    name: string;
    displayName: string;
    isActive: boolean;
  }>;
  createdAt: string;
};

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

// ─── Constants ──────────────────────────────────────────

const ACTION_COLORS: Record<string, string> = {
  CREATE:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  READ: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  UPDATE:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  MANAGE:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

const ACTION_ORDER = ["CREATE", "READ", "UPDATE", "DELETE", "MANAGE"];

// ─── Users Tab ──────────────────────────────────────────

function UsersTab() {
  const { t } = useTranslation("dashboard");
  const router = useRouter();
  const { hasPermission } = useRBAC();
  const canCreateStaff = hasPermission(
    PermissionAction.CREATE,
    PermissionResource.STAFF
  );
  const canUpdateRole = hasPermission(
    PermissionAction.UPDATE,
    PermissionResource.ROLE
  );

  const { page, limit, search, setPage, setLimit, setSearch } = usePagination({
    defaultLimit: 20,
  });

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.user.getStaff.useQuery({
    page,
    limit,
    search: search || undefined,
  });

  const { data: allRoles } = trpc.rbac.getRoles.useQuery(undefined, {
    enabled: canUpdateRole,
  });

  const assignRole = trpc.rbac.assignRole.useMutation({
    onSuccess: () => {
      toast.success(t("staffUsers.roleAssigned"));
      utils.user.getStaff.invalidate();
      setAssignDialogOpen(false);
      setSelectedRoleId("");
    },
    onError: (err) => {
      toast.error(err.message || t("staffUsers.assignError"));
    },
  });

  const handleOpenAssignDialog = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setSelectedRoleId("");
    setAssignDialogOpen(true);
  };

  const columns: TableColumn<StaffMember>[] = [
    {
      key: "name",
      title: t("staffUsers.nameCol"),
      width: "200px",
      render: (_, record) => (
        <div>
          <p className="font-medium">{record.name}</p>
          <p className="text-xs text-muted-foreground">{record.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      title: t("staffUsers.phoneCol"),
      width: "140px",
      render: (value) => (value != null && value !== "" ? String(value) : "-"),
    },
    {
      key: "roles",
      title: t("staffUsers.rolesCol"),
      width: "220px",
      render: (_, record) => (
        <div className="flex gap-1 flex-wrap">
          {record.roles?.length > 0 ? (
            record.roles
              .filter((r) => r.isActive)
              .slice(0, 3)
              .map((role) => (
                <Badge key={role.id} variant="secondary" className="text-xs">
                  {role.displayName || role.name}
                </Badge>
              ))
          ) : (
            <span className="text-xs text-muted-foreground">
              {t("staffUsers.noRoles")}
            </span>
          )}
          {record.roles?.filter((r) => r.isActive).length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{record.roles.filter((r) => r.isActive).length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      title: t("staffUsers.addedCol"),
      width: "130px",
      render: (value) =>
        new Date(value as string).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  const actions: TableAction<StaffMember>[] = [
    {
      label: t("staffUsers.viewDetails"),
      onClick: (record) => router.push(`/dashboard/staff/${record.id}`),
    },
    ...(canUpdateRole
      ? [
          {
            label: t("staffUsers.assignRole"),
            onClick: (record: StaffMember) =>
              handleOpenAssignDialog(record.id, record.name),
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("staffUsers.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {canCreateStaff && (
          <Link href="/dashboard/staff/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("staffUsers.inviteStaff")}
            </Button>
          </Link>
        )}
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
        emptyMessage={t("staffUsers.noStaffFound")}
        emptyIcon={<Users className="h-12 w-12 text-muted-foreground" />}
        emptyAction={
          canCreateStaff ? (
            <Link href="/dashboard/staff/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t("staffUsers.inviteStaff")}
              </Button>
            </Link>
          ) : undefined
        }
      />

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("staffUsers.assignRoleTitle")}</DialogTitle>
            <DialogDescription>
              {t("staffUsers.assignRoleDesc")}{" "}
              <strong>{selectedUserName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
                <SelectValue placeholder={t("staffUsers.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                {(allRoles || [])
                  .filter((r) => r.isActive)
                  .map((role) => (
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
              onClick={() => setAssignDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                if (!selectedRoleId) {
                  toast.error(t("staffUsers.selectRoleError"));
                  return;
                }
                assignRole.mutate({
                  userId: selectedUserId,
                  roleId: selectedRoleId,
                });
              }}
              disabled={!selectedRoleId || assignRole.isPending}
            >
              {assignRole.isPending
                ? t("staffUsers.assigning")
                : t("staffUsers.assign")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Roles Tab ──────────────────────────────────────────

function RolesTab() {
  const { t } = useTranslation("dashboard");
  const router = useRouter();
  const { hasPermission } = useRBAC();
  const canCreateRole = hasPermission(
    PermissionAction.CREATE,
    PermissionResource.ROLE
  );
  const canDeleteRole = hasPermission(
    PermissionAction.DELETE,
    PermissionResource.ROLE
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleRow | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDisplayName, setNewRoleDisplayName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.rbac.getAllRoles.useQuery();

  const createRole = trpc.rbac.createRole.useMutation({
    onSuccess: () => {
      toast.success(t("staffRoles.roleCreated"));
      utils.rbac.getAllRoles.invalidate();
      setCreateDialogOpen(false);
      setNewRoleName("");
      setNewRoleDisplayName("");
      setNewRoleDescription("");
    },
    onError: (err) => {
      toast.error(err.message || t("staffRoles.roleCreateError"));
    },
  });

  const deleteRole = trpc.rbac.deleteRole.useMutation({
    onSuccess: () => {
      toast.success(t("staffRoles.roleDeleted"));
      utils.rbac.getAllRoles.invalidate();
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    },
    onError: (err) => {
      toast.error(err.message || t("staffRoles.roleDeleteError"));
    },
  });

  const filteredData = useMemo(() => {
    const roles = data?.data || [];
    if (!searchTerm) return roles;
    const q = searchTerm.toLowerCase();
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(q) ||
        role.displayName.toLowerCase().includes(q) ||
        (role.description?.toLowerCase().includes(q) ?? false)
    );
  }, [data, searchTerm]);

  const columns: TableColumn<RoleRow>[] = [
    {
      key: "displayName",
      title: t("staffRoles.roleCol"),
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
      title: t("staffRoles.descriptionCol"),
      width: "250px",
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {value ? String(value) : "-"}
        </span>
      ),
    },
    {
      key: "isSystem",
      title: t("staffRoles.typeCol"),
      width: "120px",
      render: (_, record) =>
        record.isSystem ? (
          <Badge variant="outline">{t("staffRoles.systemType")}</Badge>
        ) : (
          <Badge variant="secondary">{t("staffRoles.customType")}</Badge>
        ),
    },
    {
      key: "rolePermissions",
      title: t("staffRoles.permissionsCol"),
      width: "90px",
      render: (_, record) => (
        <span className="text-sm font-medium">
          {record.rolePermissions?.length ?? 0}
        </span>
      ),
    },
    {
      key: "isActive",
      title: t("staffRoles.statusCol"),
      width: "100px",
      render: (_, record) =>
        record.isActive ? (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {t("staffRoles.activeStatus")}
          </Badge>
        ) : (
          <Badge variant="destructive">{t("staffRoles.inactiveStatus")}</Badge>
        ),
    },
  ];

  const actions: TableAction<RoleRow>[] = [
    {
      label: t("staffRoles.viewPermissions"),
      onClick: (record) => router.push(`/dashboard/roles/${record.id}`),
    },
    {
      label: t("staffRoles.editRole"),
      onClick: (record) => router.push(`/dashboard/roles/${record.id}/edit`),
    },
    ...(canDeleteRole
      ? [
          {
            label: t("staffRoles.deleteRole"),
            onClick: (record: RoleRow) => {
              if (record.isSystem) {
                toast.error(t("staffRoles.cannotDeleteSystem"));
                return;
              }
              setRoleToDelete(record);
              setDeleteDialogOpen(true);
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("staffRoles.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        {canCreateRole && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("staffRoles.newRole")}
          </Button>
        )}
      </div>

      <ScrollableTable
        data={filteredData}
        columns={columns}
        actions={actions}
        loading={isLoading}
        error={error?.message}
        emptyMessage={t("staffRoles.noRolesFound")}
        emptyIcon={<Shield className="h-12 w-12 text-muted-foreground" />}
        emptyAction={
          canCreateRole ? (
            <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("staffRoles.newRole")}
            </Button>
          ) : undefined
        }
      />

      {/* Create Role Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("staffRoles.createRoleTitle")}</DialogTitle>
            <DialogDescription>
              {t("staffRoles.createRoleDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="newDisplayName">
                {t("staffRoles.displayNameLabel")}
              </Label>
              <Input
                id="newDisplayName"
                value={newRoleDisplayName}
                onChange={(e) => setNewRoleDisplayName(e.target.value)}
                placeholder={t("staffRoles.displayNamePlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="newName">{t("staffRoles.slugLabel")}</Label>
              <Input
                id="newName"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder={t("staffRoles.slugPlaceholder")}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("staffRoles.slugHint")}
              </p>
            </div>
            <div>
              <Label htmlFor="newDescription">
                {t("staffRoles.descriptionLabel")}
              </Label>
              <Textarea
                id="newDescription"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder={t("staffRoles.descriptionPlaceholder")}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                if (!newRoleName.trim() || !newRoleDisplayName.trim()) {
                  toast.error(t("staffRoles.nameRequired"));
                  return;
                }
                createRole.mutate({
                  name: newRoleName.trim().toLowerCase().replace(/\s+/g, "_"),
                  displayName: newRoleDisplayName.trim(),
                  description: newRoleDescription.trim() || undefined,
                  isSystem: false,
                });
              }}
              disabled={createRole.isPending}
            >
              {createRole.isPending
                ? t("staffRoles.creatingRole")
                : t("staffRoles.createRole")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("staffRoles.deleteRoleTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("staffRoles.deleteRoleDesc", {
                name: roleToDelete?.displayName || "",
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
                ? t("staffRoles.deleting")
                : t("staffRoles.deleteRole")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Permissions Tab ────────────────────────────────────

function PermissionsTab() {
  const { t } = useTranslation("dashboard");
  const { data: response, isLoading } = trpc.rbac.getAllPermissions.useQuery();
  const permissions = response?.data || [];

  const grouped = useMemo(() => {
    const map: Record<
      string,
      Array<{
        id: string;
        action: string;
        resource: string;
        description: string | null;
      }>
    > = {};
    for (const p of permissions) {
      if (!map[p.resource]) {
        map[p.resource] = [];
      }
      map[p.resource]?.push(p);
    }
    for (const resource of Object.keys(map)) {
      const group = map[resource];
      if (group) {
        group.sort(
          (a, b) =>
            ACTION_ORDER.indexOf(a.action) - ACTION_ORDER.indexOf(b.action)
        );
      }
    }
    return map;
  }, [permissions]);

  const sortedResources = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("staffPermissions.loadingPerms")}
      </div>
    );
  }

  if (sortedResources.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("staffPermissions.noPerms")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t("staffPermissions.description")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedResources.map((resource) => (
          <Card key={resource}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {t(`staffPermissions.resources.${resource}`)}
              </CardTitle>
              <CardDescription className="text-xs">
                {t("staffPermissions.permCount", {
                  count: String(grouped[resource]?.length ?? 0),
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {grouped[resource]?.map((p) => {
                  const color = ACTION_COLORS[p.action];
                  return (
                    <Badge
                      key={p.id}
                      className={color || "bg-gray-100 text-gray-800"}
                    >
                      {t(`staffPermissions.actions.${p.action}`)}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────

export default function StaffPage() {
  const { t } = useTranslation("dashboard");
  const { hasPermission } = useRBAC();

  const canReadStaff = hasPermission(
    PermissionAction.READ,
    PermissionResource.STAFF
  );
  const canReadRoles = hasPermission(
    PermissionAction.READ,
    PermissionResource.ROLE
  );

  if (!canReadStaff) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noPermissionSection")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("staffPage.title")}</h1>
        <p className="text-muted-foreground">{t("staffPage.description")}</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            {t("staffPage.usersTab")}
          </TabsTrigger>
          {canReadRoles && (
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="h-4 w-4" />
              {t("staffPage.rolesTab")}
            </TabsTrigger>
          )}
          {canReadRoles && (
            <TabsTrigger value="permissions" className="gap-2">
              <KeyRound className="h-4 w-4" />
              {t("staffPage.permissionsTab")}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-4">
          <UsersTab />
        </TabsContent>

        {canReadRoles && (
          <TabsContent value="roles" className="space-y-4 mt-4">
            <RolesTab />
          </TabsContent>
        )}

        {canReadRoles && (
          <TabsContent value="permissions" className="space-y-4 mt-4">
            <PermissionsTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
