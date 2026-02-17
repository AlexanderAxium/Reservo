"use client";

import { SingleImageUpload } from "@/components/dashboard/SingleImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditOrganization({
  params,
}: { params: Promise<{ id: string }> }) {
  const { t } = useTranslation("dashboard");
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { data: tenant, isLoading } = trpc.tenant.getById.useQuery({
    id: unwrappedParams.id,
  });
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    email: "",
    plan: "FREE",
    maxFields: 10,
    maxUsers: 5,
    logoUrl: null as string | null,
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        displayName: tenant.displayName,
        email: tenant.email || "",
        plan: tenant.plan,
        maxFields: tenant.maxFields,
        maxUsers: tenant.maxUsers,
        logoUrl: tenant.logoUrl ?? null,
      });
    }
  }, [tenant]);

  const updateMutation = trpc.tenant.update.useMutation({
    onSuccess: () => {
      toast.success(t("system.organizationUpdated"));
      utils.tenant.getById.invalidate({ id: unwrappedParams.id });
      router.push(`/system/organizations/${unwrappedParams.id}`);
    },
    onError: (error) => {
      toast.error(error.message || t("system.organizationUpdateError"));
    },
  });

  const toggleActiveMutation = trpc.tenant.toggleActive.useMutation({
    onSuccess: () => {
      toast.success(t("system.organizationStatusUpdated"));
      utils.tenant.getById.invalidate({ id: unwrappedParams.id });
    },
    onError: (error) => {
      toast.error(error.message || t("system.organizationToggleError"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { plan, ...rest } = formData;
    updateMutation.mutate({
      id: unwrappedParams.id,
      ...rest,
      plan: plan as "FREE" | "BASIC" | "PROFESSIONAL" | "ENTERPRISE",
      logoUrl: formData.logoUrl,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!tenant) {
    return <div className="p-6">{t("system.organizationNotFound")}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/system/organizations/${unwrappedParams.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{t("system.editOrganization")}</h1>
          <p className="text-muted-foreground">{tenant.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{t("system.organizationInformation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SingleImageUpload
              label={t("system.organizationLogo")}
              value={formData.logoUrl}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, logoUrl: url ?? null }))
              }
              scope="tenant_logo"
              tenantIdOverride={unwrappedParams.id}
              variant="logo"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("system.organizationName")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">{t("system.displayName")} *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("system.organizationEmail")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">{t("system.plan")} *</Label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, plan: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">Free</SelectItem>
                    <SelectItem value="BASIC">Basic</SelectItem>
                    <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFields">{t("system.maxFields")}</Label>
                <Input
                  id="maxFields"
                  type="number"
                  value={formData.maxFields}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxFields: Number.parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUsers">{t("system.maxUsers")}</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={formData.maxUsers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxUsers: Number.parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button
                type="button"
                variant={tenant.isActive ? "destructive" : "default"}
                onClick={() =>
                  toggleActiveMutation.mutate({ id: unwrappedParams.id })
                }
                disabled={toggleActiveMutation.isPending}
              >
                {tenant.isActive
                  ? t("system.deactivate")
                  : t("system.activate")}{" "}
                {t("system.organization")}
              </Button>

              <div className="flex gap-2">
                <Link href={`/system/organizations/${unwrappedParams.id}`}>
                  <Button type="button" variant="outline">
                    {t("system.cancel")}
                  </Button>
                </Link>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending
                    ? t("system.saving")
                    : t("system.saveChanges")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
