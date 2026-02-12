"use client";

import { formatPrice } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type FieldMetric = {
  fieldId: string;
  fieldName: string;
  sport: string;
  totalRevenue: number;
  totalReservations: number;
  monthlyRevenue: number;
  monthlyReservations: number;
};

const CHART_COLORS = [
  "hsl(142, 76%, 36%)", // green
  "hsl(199, 89%, 48%)", // blue
  "hsl(47, 96%, 53%)", // amber
  "hsl(280, 67%, 47%)", // violet
  "hsl(0, 84%, 60%)", // red
  "hsl(173, 80%, 40%)", // teal
];

interface OwnerMetricsChartsProps {
  metrics: FieldMetric[];
}

export function OwnerMetricsCharts({ metrics }: OwnerMetricsChartsProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const barData = useMemo(
    () =>
      metrics.map((m) => ({
        name:
          m.fieldName.length > 12
            ? `${m.fieldName.slice(0, 12)}…`
            : m.fieldName,
        fullName: m.fieldName,
        reservas: m.totalReservations,
        reservasMes: m.monthlyReservations,
        ingresos: m.totalRevenue,
        ingresosMes: m.monthlyRevenue,
      })),
    [metrics]
  );

  const pieData = useMemo(
    () =>
      metrics.map((m, i) => ({
        name: m.fieldName,
        value: m.totalReservations,
        color: CHART_COLORS[i % CHART_COLORS.length],
      })),
    [metrics]
  );

  const textColor = isDark ? "hsl(0, 0%, 90%)" : "hsl(0, 0%, 15%)";
  const gridColor = isDark ? "hsl(0, 0%, 25%)" : "hsl(0, 0%, 90%)";

  if (!metrics.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfica de barras: reservas por cancha (uso) */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Reservas por cancha (más usado)
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Compara qué cancha o espacio tiene más reservas
        </p>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 8, right: 8, left: 0, bottom: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="name"
                tick={{ fill: textColor, fontSize: 12 }}
                tickLine={{ stroke: gridColor }}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis
                tick={{ fill: textColor, fontSize: 12 }}
                tickLine={{ stroke: gridColor }}
                axisLine={{ stroke: gridColor }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "hsl(0, 0%, 12%)" : "white",
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: textColor }}
                formatter={(value: number) => [value, "Reservas"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar
                dataKey="reservas"
                name="Reservas totales"
                fill={CHART_COLORS[0]}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="reservasMes"
                name="Reservas este mes"
                fill={CHART_COLORS[1]}
                radius={[4, 4, 0, 0]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => (
                  <span style={{ color: textColor }}>{value}</span>
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica de barras: ingresos por cancha */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Ingresos por cancha
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Compara ingresos totales y del mes por cancha
        </p>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 8, right: 8, left: 0, bottom: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="name"
                tick={{ fill: textColor, fontSize: 12 }}
                tickLine={{ stroke: gridColor }}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis
                tick={{ fill: textColor, fontSize: 12 }}
                tickLine={{ stroke: gridColor }}
                axisLine={{ stroke: gridColor }}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "hsl(0, 0%, 12%)" : "white",
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: textColor }}
                formatter={(value: number) => [formatPrice(value), "Ingresos"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? ""
                }
              />
              <Bar
                dataKey="ingresos"
                name="Ingresos totales"
                fill={CHART_COLORS[2]}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="ingresosMes"
                name="Ingresos este mes"
                fill={CHART_COLORS[3]}
                radius={[4, 4, 0, 0]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => (
                  <span style={{ color: textColor }}>{value}</span>
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica de torta: distribución de uso */}
      <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Distribución de uso por cancha
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Porcentaje de reservas por cancha para identificar las más usadas
        </p>
        <div className="h-[340px] w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <ResponsiveContainer
            width="100%"
            height={280}
            className="min-h-[240px]"
          >
            <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: gridColor }}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "hsl(0, 0%, 12%)" : "white",
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) => [
                  `${value} reservas`,
                  name,
                ]}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: "16px" }}
                formatter={(value, entry) => {
                  const payload = entry?.payload as
                    | { value?: number; percent?: number }
                    | undefined;
                  const total = pieData.reduce((s, d) => s + d.value, 0);
                  const pct =
                    payload?.value != null && total > 0
                      ? ((payload.value / total) * 100).toFixed(0)
                      : "0";
                  return (
                    <span
                      style={{ color: textColor }}
                      className="text-xs block py-0.5 break-words max-w-full"
                    >
                      {value}: {pct}%
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
