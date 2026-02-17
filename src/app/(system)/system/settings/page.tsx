"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Settings } from "lucide-react";

export default function SystemSettings() {
  const { t } = useTranslation("dashboard");

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title={t("system.settingsTitle")}
        description={t("system.settingsDesc")}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t("system.platformConfiguration")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t("system.settingsComingSoon")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
