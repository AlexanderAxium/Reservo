"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { SingleImageUpload } from "@/components/dashboard/SingleImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { t } = useTranslation("dashboard");
  const { isLoading: userLoading } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: null as string | null,
  });

  const { data: profile, isLoading: profileLoading } =
    trpc.user.getProfile.useQuery();

  const updateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      toast.success(t("profilePage.profileUpdated"));
      setFormData({ ...formData, password: "", confirmPassword: "" });
    },
    onError: (error) => {
      toast.error(error.message || t("profilePage.updateError"));
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email,
        phone: profile.phone || "",
        password: "",
        confirmPassword: "",
        image: profile.image ?? null,
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error(t("profilePage.passwordMismatch"));
      return;
    }

    const updateData: Record<string, string | null> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      image: formData.image,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    updateMutation.mutate(updateData);
  };

  if (userLoading || profileLoading) {
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
        title={t("profilePage.title")}
        description={t("profilePage.description")}
      />

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("profilePage.personalInfo")}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <SingleImageUpload
            label={t("upload.avatarLabel")}
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url ?? null })}
            scope="profile_avatar"
            variant="avatar"
          />
          <div className="space-y-2">
            <Label htmlFor="name">{t("profilePage.nameLabel")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t("profilePage.namePlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("profilePage.emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder={t("profilePage.emailPlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("profilePage.phoneLabel")}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder={t("profilePage.phonePlaceholder")}
            />
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("profilePage.changePassword")}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  {t("profilePage.newPasswordLabel")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={t("profilePage.newPasswordPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t("profilePage.confirmPasswordLabel")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder={t("profilePage.confirmPasswordPlaceholder")}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending
                ? t("profilePage.saving")
                : t("profilePage.saveChanges")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
