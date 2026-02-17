"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { ImageUpload } from "@/components/fields/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditSportCenterPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const id = params.id as string;

  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "",
    city: "Lima",
    phone: "",
    email: "",
    description: "",
  });

  const { data: sportCenter, isLoading } = trpc.sportCenter.getById.useQuery({
    id,
  });

  const updateMutation = trpc.sportCenter.update.useMutation({
    onSuccess: () => {
      toast.success(t("sportCenterForm.centerUpdated"));
      router.push(`/dashboard/sport-centers/${id}`);
    },
    onError: (error) => {
      toast.error(error.message || t("sportCenterForm.updateError"));
    },
  });

  useEffect(() => {
    if (sportCenter) {
      setFormData({
        name: sportCenter.name,
        address: sportCenter.address,
        district: sportCenter.district || "",
        city: sportCenter.city || "Lima",
        phone: sportCenter.phone || "",
        email: sportCenter.email || "",
        description: sportCenter.description || "",
      });
      setImages(sportCenter.images ?? []);
    }
  }, [sportCenter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id, ...formData, images });
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

  if (!sportCenter) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">{t("sportCenterForm.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={t("sportCenterForm.editTitle")}
        description={t("sportCenterForm.editDesc")}
        backHref="/dashboard/sport-centers"
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("sportCenterForm.nameLabel")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={t("sportCenterForm.namePlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">{t("sportCenterForm.cityLabel")}</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder={t("sportCenterForm.cityPlaceholder")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t("sportCenterForm.addressLabel")}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder={t("sportCenterForm.addressPlaceholder")}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district">
                {t("sportCenterForm.districtLabel")}
              </Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                placeholder={t("sportCenterForm.districtPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("sportCenterForm.phoneLabel")}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder={t("sportCenterForm.phonePlaceholder")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("sportCenterForm.emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder={t("sportCenterForm.emailPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("sportCenterForm.descriptionLabel")}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t("sportCenterForm.descriptionPlaceholder")}
              rows={4}
            />
          </div>

          <ImageUpload
            images={images}
            onImagesChange={setImages}
            scope="sport_center"
            maxImages={10}
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending
                ? t("sportCenterForm.saving")
                : t("sportCenterForm.saveChanges")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
