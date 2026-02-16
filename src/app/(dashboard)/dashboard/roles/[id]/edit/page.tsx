"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function EditRolePage() {
  const params = useParams();
  const roleId = params.id as string;
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const { hasPermission } = useRBAC();

  const [displayName, setDisplayName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loaded, setLoaded] = useState(false);

  const { data: rolesData, isLoading } = trpc.rbac.getAllRoles.useQuery();

  const role = useMemo(
    () => rolesData?.data?.find((r) => r.id === roleId),
    [rolesData, roleId]
  );

  useEffect(() => {
    if (role && !loaded) {
      setDisplayName(role.displayName);
      setName(role.name);
      setDescription(role.description || "");
      setLoaded(true);
    }
  }, [role, loaded]);

  const updateRole = trpc.rbac.updateRole.useMutation({
    onSuccess: () => {
      toast.success(t("roleEdit.roleUpdated"));
      router.push(`/dashboard/roles/${roleId}`);
    },
    onError: (err) => {
      toast.error(err.message || t("roleEdit.roleUpdateError"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error(t("roleEdit.displayNameRequired"));
      return;
    }

    const data: {
      id: string;
      displayName: string;
      description?: string;
      name?: string;
    } = {
      id: roleId,
      displayName: displayName.trim(),
      description: description.trim() || undefined,
    };

    if (!role?.isSystem) {
      data.name = name.trim().toLowerCase().replace(/\s+/g, "_");
    }

    updateRole.mutate(data);
  };

  if (!hasPermission(PermissionAction.UPDATE, PermissionResource.ROLE)) {
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
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-xl" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("roleEdit.notFound")}</p>
          <Link href="/dashboard/staff">
            <Button variant="link" className="mt-2">
              {t("roleEdit.backToTeam")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/roles/${roleId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("roleEdit.back")}
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {t("roleEdit.title", { name: role.displayName })}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("roleEdit.description")}
          </p>
        </div>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{t("roleEdit.cardTitle")}</CardTitle>
          <CardDescription>
            {role.isSystem
              ? t("roleEdit.cardDescSystem")
              : t("roleEdit.cardDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="displayName">
                {t("roleEdit.displayNameLabel")}
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("roleEdit.displayNamePlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="name">{t("roleEdit.slugLabel")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("roleEdit.slugPlaceholder")}
                disabled={role.isSystem}
                required
              />
              {role.isSystem && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t("roleEdit.slugHint")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="description">
                {t("roleEdit.descriptionLabel")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("roleEdit.descriptionPlaceholder")}
                rows={3}
              />
            </div>
            <Button
              type="submit"
              disabled={updateRole.isPending}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateRole.isPending
                ? t("roleEdit.saving")
                : t("roleEdit.saveChanges")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
