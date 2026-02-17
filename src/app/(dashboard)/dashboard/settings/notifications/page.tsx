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
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/hooks/useTranslation";
import { Bell, Info, Mail } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "reservo_notification_prefs";

interface NotificationPreferences {
  emailNewReservation: boolean;
  emailCancellation: boolean;
  emailPayment: boolean;
  emailDailyDigest: boolean;
  pushNewReservation: boolean;
  pushReminder: boolean;
}

const defaultPreferences: NotificationPreferences = {
  emailNewReservation: true,
  emailCancellation: true,
  emailPayment: true,
  emailDailyDigest: false,
  pushNewReservation: true,
  pushReminder: true,
};

function loadPreferences(): NotificationPreferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultPreferences, ...JSON.parse(stored) };
  } catch {
    // ignorar errores de parse
  }
  return defaultPreferences;
}

export default function SettingsNotificationsPage() {
  const { t } = useTranslation("dashboard");
  const [prefs, setPrefs] =
    useState<NotificationPreferences>(defaultPreferences);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPrefs(loadPreferences());
  }, []);

  const togglePref = useCallback((key: keyof NotificationPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      toast.success(t("settingsNotifications.saved"));
    } catch {
      toast.error("Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={t("settingsNotifications.title")}
        description={t("settingsNotifications.description")}
      />

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5" />
            {t("settingsNotifications.emailNotifications")}
          </CardTitle>
          <CardDescription>
            {t("settingsNotifications.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationRow
            label={t("settingsNotifications.emailNewReservation")}
            description={t("settingsNotifications.emailNewReservationDesc")}
            checked={prefs.emailNewReservation}
            onCheckedChange={() => togglePref("emailNewReservation")}
          />
          <NotificationRow
            label={t("settingsNotifications.emailCancellation")}
            description={t("settingsNotifications.emailCancellationDesc")}
            checked={prefs.emailCancellation}
            onCheckedChange={() => togglePref("emailCancellation")}
          />
          <NotificationRow
            label={t("settingsNotifications.emailPayment")}
            description={t("settingsNotifications.emailPaymentDesc")}
            checked={prefs.emailPayment}
            onCheckedChange={() => togglePref("emailPayment")}
          />
          <NotificationRow
            label={t("settingsNotifications.emailDailyDigest")}
            description={t("settingsNotifications.emailDailyDigestDesc")}
            checked={prefs.emailDailyDigest}
            onCheckedChange={() => togglePref("emailDailyDigest")}
          />
        </CardContent>
      </Card>

      {/* Push */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            {t("settingsNotifications.pushNotifications")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationRow
            label={t("settingsNotifications.pushNewReservation")}
            description={t("settingsNotifications.pushNewReservationDesc")}
            checked={prefs.pushNewReservation}
            onCheckedChange={() => togglePref("pushNewReservation")}
          />
          <NotificationRow
            label={t("settingsNotifications.pushReminder")}
            description={t("settingsNotifications.pushReminderDesc")}
            checked={prefs.pushReminder}
            onCheckedChange={() => togglePref("pushReminder")}
          />
        </CardContent>
      </Card>

      {/* Nota informativa */}
      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <Info className="h-4 w-4 mt-0.5 shrink-0" />
        <p>{t("settingsNotifications.localNote")}</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving
            ? t("settingsNotifications.saving")
            : t("settingsNotifications.savePreferences")}
        </Button>
      </div>
    </div>
  );
}

function NotificationRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
