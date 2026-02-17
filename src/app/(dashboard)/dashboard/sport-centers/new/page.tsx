"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { ImageUpload } from "@/components/fields/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PERU_DEPARTMENTS } from "@/constants/peru";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewSportCenterPage() {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "",
    department: "Lima",
    province: "",
    phone: "",
    email: "",
    description: "",
  });

  const createMutation = trpc.sportCenter.create.useMutation({
    onSuccess: () => {
      toast.success(t("sportCenterForm.centerCreated"));
      router.push("/dashboard/sport-centers");
    },
    onError: (error) => {
      toast.error(error.message || t("sportCenterForm.createError"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...formData, images });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={t("sportCenterForm.newTitle")}
        description={t("sportCenterForm.newDesc")}
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
              <Label htmlFor="department">
                {t("sportCenterForm.departmentLabel")}
              </Label>
              <Select
                value={formData.department}
                onValueChange={(val) =>
                  setFormData({ ...formData, department: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {PERU_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="province">
                {t("sportCenterForm.provinceLabel")}
              </Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
                placeholder={t("sportCenterForm.provincePlaceholder")}
              />
            </div>

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
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending
                ? t("sportCenterForm.creating")
                : t("sportCenterForm.createCenter")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
