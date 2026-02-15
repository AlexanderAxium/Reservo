"use client";

import { Card } from "@/components/ui/card";

export default function SettingsNotificationsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notificaciones</h1>
        <p className="text-muted-foreground">
          Gestiona tus preferencias de notificaciones
        </p>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground text-center py-12">
          Esta funcionalidad estará disponible próximamente.
        </p>
      </Card>
    </div>
  );
}
