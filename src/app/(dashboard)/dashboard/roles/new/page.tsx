"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
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
import { Textarea } from "@/components/ui/textarea";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewRolePage() {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const { hasPermission } = useRBAC();
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");

  const createRole = trpc.rbac.createRole.useMutation({
    onSuccess: () => {
      toast.success(t("roleNew.roleCreated"));
      router.push("/dashboard/staff");
    },
    onError: (err) => {
      toast.error(err.message || t("roleNew.roleCreateError"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !displayName.trim()) {
      toast.error(t("roleNew.nameRequired"));
      return;
    }
    createRole.mutate({
      name: name.trim().toLowerCase().replace(/\s+/g, "_"),
      displayName: displayName.trim(),
      description: description.trim() || undefined,
      isSystem: false,
    });
  };

  if (!hasPermission(PermissionAction.CREATE, PermissionResource.ROLE)) {
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
      <PageHeader
        title={t("roleNew.title")}
        description={t("roleNew.description")}
        backHref="/dashboard/staff"
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{t("roleNew.cardTitle")}</CardTitle>
          <CardDescription>{t("roleNew.cardDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="displayName">
                {t("roleNew.displayNameLabel")}
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("roleNew.displayNamePlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="name">{t("roleNew.slugLabel")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("roleNew.slugPlaceholder")}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("roleNew.slugHint")}
              </p>
            </div>
            <div>
              <Label htmlFor="description">
                {t("roleNew.descriptionLabel")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("roleNew.descriptionPlaceholder")}
                rows={3}
              />
            </div>
            <Button
              type="submit"
              disabled={createRole.isPending}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {createRole.isPending
                ? t("roleNew.creating")
                : t("roleNew.createRole")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
