"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { SingleImageUpload } from "@/components/dashboard/SingleImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsGeneralPage() {
  const { t } = useTranslation("dashboard");
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    website: "",
    description: "",
    logoUrl: null as string | null,
    faviconUrl: null as string | null,
  });

  const { data: tenant, isLoading } = trpc.tenant.getMyTenant.useQuery();
  const { data: companyInfo } = trpc.companyInfo.get.useQuery();

  const updateMutation = trpc.companyInfo.update.useMutation({
    onSuccess: () => {
      toast.success(t("settingsGeneral.settingsUpdated"));
    },
    onError: (error) => {
      toast.error(error.message || t("settingsGeneral.updateError"));
    },
  });

  useEffect(() => {
    if (tenant || companyInfo) {
      const data = tenant || companyInfo;
      if (data && "displayName" in data) {
        const d = data as {
          displayName?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          website?: string | null;
          description?: string | null;
          logoUrl?: string | null;
          faviconUrl?: string | null;
        };
        setFormData({
          displayName: d.displayName || "",
          email: d.email || "",
          phone: d.phone || "",
          address: d.address || "",
          city: d.city || "",
          website: d.website || "",
          description: d.description || "",
          logoUrl: d.logoUrl ?? null,
          faviconUrl: d.faviconUrl ?? null,
        });
      }
    }
  }, [tenant, companyInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      displayName: formData.displayName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      website: formData.website,
      description: formData.description,
      logoUrl: formData.logoUrl,
      faviconUrl: formData.faviconUrl,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={t("settingsGeneral.title")}
        description={t("settingsGeneral.description")}
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("settingsGeneral.branding")}
            </h3>
            <SingleImageUpload
              label={t("upload.logoLabel")}
              value={formData.logoUrl}
              onChange={(url) =>
                setFormData({ ...formData, logoUrl: url ?? null })
              }
              scope="tenant_logo"
              variant="logo"
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("settingsGeneral.companyInfo")}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">
                    {t("settingsGeneral.displayNameLabel")}
                  </Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    placeholder={t("settingsGeneral.displayNamePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t("settingsGeneral.emailLabel")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder={t("settingsGeneral.emailPlaceholder")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {t("settingsGeneral.phoneLabel")}
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder={t("settingsGeneral.phonePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">
                    {t("settingsGeneral.websiteLabel")}
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder={t("settingsGeneral.websitePlaceholder")}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {t("settingsGeneral.location")}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      {t("settingsGeneral.addressLabel")}
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder={t("settingsGeneral.addressPlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">
                      {t("settingsGeneral.cityLabel")}
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder={t("settingsGeneral.cityPlaceholder")}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {t("settingsGeneral.descriptionSection")}
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t("settingsGeneral.descriptionLabel")}
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder={t("settingsGeneral.descriptionPlaceholder")}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending
                ? t("settingsGeneral.saving")
                : t("settingsGeneral.saveChanges")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
