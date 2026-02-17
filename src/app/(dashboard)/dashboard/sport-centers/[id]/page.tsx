"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { Building2, Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SportCenterDetailPage() {
  const params = useParams();
  const { t } = useTranslation("dashboard");
  const id = params.id as string;

  const { data: sportCenter, isLoading } = trpc.sportCenter.getById.useQuery({
    id,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </Card>
      </div>
    );
  }

  if (!sportCenter) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          {t("sportCenterDetail.notFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={sportCenter.name}
        backHref="/dashboard/sport-centers"
        actions={
          <Link href={`/dashboard/sport-centers/${id}/edit`}>
            <Button size="sm">{t("sportCenterDetail.editCenter")}</Button>
          </Link>
        }
      />

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("sportCenterDetail.nameLabel")}
              </p>
              <p className="text-base">{sportCenter.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("sportCenterDetail.addressLabel")}
              </p>
              <p className="text-base">{sportCenter.address}</p>
              <p className="text-sm text-muted-foreground">
                {sportCenter.district && `${sportCenter.district}, `}
                {sportCenter.city}
              </p>
            </div>
          </div>

          {sportCenter.phone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("sportCenterDetail.phoneLabel")}
                </p>
                <p className="text-base">{sportCenter.phone}</p>
              </div>
            </div>
          )}

          {sportCenter.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("sportCenterDetail.emailLabel")}
                </p>
                <p className="text-base">{sportCenter.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("sportCenterDetail.ownerLabel")}
              </p>
              <p className="text-base">{sportCenter.owner.name}</p>
              <p className="text-sm text-muted-foreground">
                {sportCenter.owner.email}
              </p>
            </div>
          </div>

          {sportCenter.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t("sportCenterDetail.descriptionLabel")}
              </p>
              <p className="text-base">{sportCenter.description}</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {t("sportCenterDetail.fieldsTitle")}
        </h3>
        {sportCenter.fields.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t("sportCenterDetail.noFields")}
          </p>
        ) : (
          <div className="space-y-3">
            {sportCenter.fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{field.name}</p>
                  <p className="text-sm text-muted-foreground">{field.sport}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">S/ {Number(field.price)}</p>
                  <p className="text-sm text-muted-foreground">
                    {field.available
                      ? t("sportCenterDetail.availableStatus")
                      : t("sportCenterDetail.unavailableStatus")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
