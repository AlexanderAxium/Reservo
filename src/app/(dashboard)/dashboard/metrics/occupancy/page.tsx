"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";

export default function MetricsOccupancyPage() {
  const { data: occupancyData, isLoading } = trpc.metrics.occupancy.useQuery();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const avgOccupancy = occupancyData?.length
    ? occupancyData.reduce((sum, item) => sum + item.occupancyRate, 0) /
      occupancyData.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ocupación de Canchas</h1>
        <p className="text-muted-foreground">Tasas de ocupación por cancha</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Promedio de Ocupación
          </p>
          <p className="text-3xl font-bold mt-2">{avgOccupancy.toFixed(1)}%</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Canchas</p>
          <p className="text-3xl font-bold mt-2">
            {occupancyData?.length || 0}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Total Reservas
          </p>
          <p className="text-3xl font-bold mt-2">
            {occupancyData?.reduce((sum, item) => sum + item.reservations, 0) ||
              0}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detalle por Cancha</h3>
        <div className="space-y-3">
          {occupancyData && occupancyData.length > 0 ? (
            occupancyData.map((item) => (
              <div key={item.fieldId} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{item.fieldName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.sport}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {item.occupancyRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">ocupación</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-3 pt-3 border-t">
                  <span className="text-muted-foreground">
                    {item.reservations} reservas
                  </span>
                  <span className="font-medium">
                    S/ {item.revenue.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No hay datos de ocupación disponibles
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
