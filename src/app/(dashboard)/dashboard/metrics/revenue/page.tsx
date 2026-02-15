"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/hooks/useTRPC";

export default function MetricsRevenuePage() {
  const { data: revenueData, isLoading } = trpc.metrics.revenue.useQuery({
    groupBy: "day",
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const totalRevenue =
    revenueData?.reduce((sum, item) => sum + item.revenue, 0) || 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ingresos</h1>
        <p className="text-muted-foreground">
          Desglose de ingresos por periodo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Total Ingresos
          </p>
          <p className="text-3xl font-bold mt-2">
            S/ {totalRevenue.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Periodos</p>
          <p className="text-3xl font-bold mt-2">{revenueData?.length || 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Promedio por Periodo
          </p>
          <p className="text-3xl font-bold mt-2">
            S/{" "}
            {revenueData?.length
              ? (totalRevenue / revenueData.length).toFixed(2)
              : "0.00"}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ingresos por Periodo</h3>
        <div className="space-y-3">
          {revenueData && revenueData.length > 0 ? (
            revenueData.map((item) => (
              <div
                key={item.period}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span className="text-sm font-medium">{item.period}</span>
                <span className="text-lg font-bold">
                  S/ {item.revenue.toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No hay datos de ingresos disponibles
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
