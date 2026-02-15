"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import {
  BarChart3,
  ChevronRight,
  DollarSign,
  MapPin,
  TrendingUp,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const OwnerMetricsCharts = dynamic(
  () =>
    import("@/components/dashboard/owner/OwnerMetricsCharts").then(
      (mod) => mod.OwnerMetricsCharts
    ),
  { ssr: false }
);

const SPORT_LABELS: Record<string, string> = {
  FOOTBALL: "Fútbol",
  TENNIS: "Tenis",
  BASKETBALL: "Básquet",
  VOLLEYBALL: "Vóley",
  FUTSAL: "Futsal",
};

export default function OwnerMetricsPage() {
  const { data: metrics, isLoading } =
    trpc.reservation.getOwnerRevenueByField.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const totals = metrics
    ? metrics.reduce(
        (acc, m) => ({
          totalRevenue: acc.totalRevenue + m.totalRevenue,
          totalReservations: acc.totalReservations + m.totalReservations,
          monthlyRevenue: acc.monthlyRevenue + m.monthlyRevenue,
          monthlyReservations: acc.monthlyReservations + m.monthlyReservations,
        }),
        {
          totalRevenue: 0,
          totalReservations: 0,
          monthlyRevenue: 0,
          monthlyReservations: 0,
        }
      )
    : null;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/dashboard/owner"
            className="hover:text-foreground transition-colors"
          >
            Dueño
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">
            Métricas e ingresos
          </span>
        </nav>

        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Métricas e ingresos por cancha
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ingresos y reservas confirmadas o completadas, por cancha
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-6 bg-muted rounded w-16 mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ingresos totales
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatPrice(totals?.totalRevenue ?? 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Todas las canchas (histórico)
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ingresos del mes
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatPrice(totals?.monthlyRevenue ?? 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mes actual
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Reservas totales
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-foreground">
                    {totals?.totalReservations ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Confirmadas + completadas
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Reservas del mes
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-foreground">
                    {totals?.monthlyReservations ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mes actual
                  </p>
                </CardContent>
              </Card>
            </div>

            {metrics && metrics.length > 0 && (
              <OwnerMetricsCharts metrics={metrics} />
            )}

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ingresos por cancha
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Desglose por cancha (solo reservas confirmadas o completadas)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!metrics?.length ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No tienes canchas o aún no hay ingresos registrados.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-foreground">
                          Cancha
                        </TableHead>
                        <TableHead className="text-foreground">
                          Deporte
                        </TableHead>
                        <TableHead className="text-foreground text-right">
                          Ingresos totales
                        </TableHead>
                        <TableHead className="text-foreground text-right">
                          Reservas totales
                        </TableHead>
                        <TableHead className="text-foreground text-right">
                          Ingresos mes
                        </TableHead>
                        <TableHead className="text-foreground text-right">
                          Reservas mes
                        </TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metrics.map((m) => (
                        <TableRow key={m.fieldId}>
                          <TableCell className="font-medium text-foreground">
                            {m.fieldName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-normal">
                              {SPORT_LABELS[m.sport] ?? m.sport}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatPrice(m.totalRevenue)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {m.totalReservations}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {formatPrice(m.monthlyRevenue)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {m.monthlyReservations}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/dashboard/owner/fields/${m.fieldId}`}
                              className="text-primary hover:underline text-sm inline-flex items-center"
                            >
                              Ver
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
