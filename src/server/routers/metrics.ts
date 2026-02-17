import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/db";
import {
  router,
  sysAdminProcedure,
  tenantAdminProcedure,
  tenantStaffProcedure,
} from "../trpc";
import { requireTenantId } from "../utils/tenant";

const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const metricsRouter = router({
  // Vista general del tenant (KPIs para dashboard) - TENANT_ADMIN
  tenantOverview: tenantAdminProcedure
    .input(dateRangeSchema.optional())
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const now = new Date();
      const startDate = input?.startDate
        ? new Date(input.startDate)
        : new Date(now.getFullYear(), now.getMonth(), 1); // Primer día del mes
      const endDate = input?.endDate
        ? new Date(input.endDate)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // Último día del mes

      // Contar canchas activas
      const totalFields = await prisma.field.count({
        where: {
          tenantId,
          available: true,
        },
      });

      // Contar reservas en el período
      const reservations = await prisma.reservation.findMany({
        where: {
          field: { tenantId },
          startDate: { gte: startDate, lte: endDate },
        },
        select: {
          status: true,
          amount: true,
        },
      });

      const totalReservations = reservations.length;
      const confirmedReservations = reservations.filter(
        (r) => r.status === "CONFIRMED" || r.status === "COMPLETED"
      ).length;
      const pendingReservations = reservations.filter(
        (r) => r.status === "PENDING"
      ).length;
      const cancelledReservations = reservations.filter(
        (r) => r.status === "CANCELLED"
      ).length;

      // Calcular ingresos
      const revenue = reservations
        .filter((r) => r.status === "CONFIRMED" || r.status === "COMPLETED")
        .reduce((sum, r) => sum + Number(r.amount), 0);

      // Contar clientes únicos (usuarios con reservas)
      const uniqueClients = await prisma.reservation.groupBy({
        by: ["userId"],
        where: {
          field: { tenantId },
          startDate: { gte: startDate, lte: endDate },
          userId: { not: null },
        },
        _count: true,
      });

      return {
        totalFields,
        totalReservations,
        confirmedReservations,
        pendingReservations,
        cancelledReservations,
        revenue,
        uniqueClients: uniqueClients.length,
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      };
    }),

  // Horas reservadas por día (para gráfico en dashboard)
  hoursReservedByDay: tenantStaffProcedure
    .input(
      z.object({
        days: z.number().min(7).max(90).optional().default(14),
      })
    )
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);
      startDate.setHours(0, 0, 0, 0);

      const reservations = await prisma.reservation.findMany({
        where: {
          field: { tenantId },
          startDate: { gte: startDate, lte: endDate },
          status: { in: ["CONFIRMED", "COMPLETED", "PENDING"] },
        },
        select: {
          startDate: true,
          endDate: true,
        },
      });

      const hoursByDay = new Map<string, number>();

      for (let d = 0; d < input.days; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + d);
        const key = date.toISOString().slice(0, 10);
        hoursByDay.set(key, 0);
      }

      for (const r of reservations) {
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const key = start.toISOString().slice(0, 10);
        if (hoursByDay.has(key)) {
          hoursByDay.set(key, (hoursByDay.get(key) ?? 0) + hours);
        }
      }

      return Array.from(hoursByDay.entries())
        .map(([date, hours]) => ({
          date,
          hours: Math.round(hours * 100) / 100,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }),

  // Ingresos por día (para gráfico en dashboard)
  revenueByDay: tenantStaffProcedure
    .input(
      z.object({
        days: z.number().min(7).max(90).optional().default(14),
      })
    )
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);
      startDate.setHours(0, 0, 0, 0);

      const reservations = await prisma.reservation.findMany({
        where: {
          field: { tenantId },
          startDate: { gte: startDate, lte: endDate },
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
        select: {
          startDate: true,
          amount: true,
        },
      });

      const revenueByDay = new Map<string, number>();

      for (let d = 0; d < input.days; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + d);
        const key = date.toISOString().slice(0, 10);
        revenueByDay.set(key, 0);
      }

      for (const r of reservations) {
        const key = new Date(r.startDate).toISOString().slice(0, 10);
        if (revenueByDay.has(key)) {
          revenueByDay.set(
            key,
            (revenueByDay.get(key) ?? 0) + Number(r.amount)
          );
        }
      }

      return Array.from(revenueByDay.entries())
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }),

  // Ingresos por período - TENANT_ADMIN (mantener para compatibilidad si se usa en otro lado)
  revenue: tenantAdminProcedure
    .input(
      dateRangeSchema.extend({
        groupBy: z.enum(["day", "week", "month"]).optional().default("day"),
      })
    )
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const now = new Date();
      const startDate = input.startDate
        ? new Date(input.startDate)
        : new Date(now.getFullYear(), now.getMonth() - 2, 1); // Últimos 3 meses
      const endDate = input.endDate ? new Date(input.endDate) : now;

      const reservations = await prisma.reservation.findMany({
        where: {
          field: { tenantId },
          startDate: { gte: startDate, lte: endDate },
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
        select: {
          startDate: true,
          amount: true,
        },
        orderBy: {
          startDate: "asc",
        },
      });

      // Agrupar por período
      const revenueByPeriod = new Map<string, number>();

      reservations.forEach((r) => {
        const date = new Date(r.startDate);
        let key: string;

        if (input.groupBy === "month") {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        } else if (input.groupBy === "week") {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split("T")[0] ?? "";
        } else {
          key = date.toISOString().split("T")[0] ?? "";
        }

        const current = revenueByPeriod.get(key) || 0;
        revenueByPeriod.set(key, current + Number(r.amount));
      });

      return Array.from(revenueByPeriod.entries())
        .map(([period, revenue]) => ({
          period,
          revenue,
        }))
        .sort((a, b) => a.period.localeCompare(b.period));
    }),

  // Ocupación de canchas - TENANT_ADMIN
  occupancy: tenantAdminProcedure
    .input(dateRangeSchema.optional())
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const now = new Date();
      const startDate = input?.startDate
        ? new Date(input.startDate)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = input?.endDate
        ? new Date(input.endDate)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      // Obtener todas las canchas del tenant
      const fields = await prisma.field.findMany({
        where: { tenantId },
        select: {
          id: true,
          name: true,
          sport: true,
        },
      });

      // Obtener reservas por cancha
      const reservationsByField = await prisma.reservation.groupBy({
        by: ["fieldId"],
        where: {
          field: { tenantId },
          startDate: { gte: startDate, lte: endDate },
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
        _count: true,
        _sum: {
          amount: true,
        },
      });

      const reservationMap = new Map(
        reservationsByField.map((r) => [
          r.fieldId,
          {
            count: r._count,
            revenue: Number(r._sum.amount ?? 0),
          },
        ])
      );

      // Calcular ocupación (simplificado - asumiendo 10 horas disponibles por día)
      const daysInPeriod = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const hoursPerDay = 10;
      const totalAvailableHours = daysInPeriod * hoursPerDay;

      return fields.map((field) => {
        const data = reservationMap.get(field.id) || { count: 0, revenue: 0 };
        const occupancyRate =
          totalAvailableHours > 0
            ? (data.count / totalAvailableHours) * 100
            : 0;

        return {
          fieldId: field.id,
          fieldName: field.name,
          sport: field.sport,
          reservations: data.count,
          revenue: data.revenue,
          occupancyRate: Math.round(occupancyRate * 100) / 100,
        };
      });
    }),

  // Vista general global (todos los tenants) - SYS_ADMIN
  globalOverview: sysAdminProcedure
    .input(dateRangeSchema.optional())
    .query(async ({ input }) => {
      const now = new Date();
      const startDate = input?.startDate
        ? new Date(input.startDate)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = input?.endDate
        ? new Date(input.endDate)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      // Total de tenants activos
      const totalTenants = await prisma.tenant.count({
        where: { isActive: true },
      });

      // Total de canchas
      const totalFields = await prisma.field.count({
        where: { available: true },
      });

      // Total de usuarios
      const totalUsers = await prisma.user.count();

      // Reservas en el período
      const reservations = await prisma.reservation.findMany({
        where: {
          startDate: { gte: startDate, lte: endDate },
        },
        select: {
          status: true,
          amount: true,
        },
      });

      const totalReservations = reservations.length;
      const confirmedReservations = reservations.filter(
        (r) => r.status === "CONFIRMED" || r.status === "COMPLETED"
      ).length;

      const revenue = reservations
        .filter((r) => r.status === "CONFIRMED" || r.status === "COMPLETED")
        .reduce((sum, r) => sum + Number(r.amount), 0);

      return {
        totalTenants,
        totalFields,
        totalUsers,
        totalReservations,
        confirmedReservations,
        revenue,
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      };
    }),

  // Ranking de tenants (top tenants por ingresos) - SYS_ADMIN
  tenantRanking: sysAdminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional().default(10),
        ...dateRangeSchema.shape,
      })
    )
    .query(async ({ input }) => {
      const now = new Date();
      const startDate = input.startDate
        ? new Date(input.startDate)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = input.endDate
        ? new Date(input.endDate)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      // Obtener tenants con sus estadísticas
      const tenants = await prisma.tenant.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          displayName: true,
          _count: {
            select: {
              fields: true,
              users: true,
            },
          },
        },
      });

      // Obtener reservas por tenant
      const reservationsByTenant = await prisma.reservation.groupBy({
        by: ["fieldId"],
        where: {
          startDate: { gte: startDate, lte: endDate },
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
        _count: true,
        _sum: {
          amount: true,
        },
      });

      // Agrupar por tenantId (necesitamos hacer join con fields)
      const fieldToTenant = await prisma.field.findMany({
        select: {
          id: true,
          tenantId: true,
        },
      });

      const fieldTenantMap = new Map(
        fieldToTenant.map((f) => [f.id, f.tenantId])
      );

      const tenantStats = new Map<
        string,
        { reservations: number; revenue: number }
      >();

      reservationsByTenant.forEach((r) => {
        const tenantId = fieldTenantMap.get(r.fieldId);
        if (tenantId) {
          const current = tenantStats.get(tenantId) || {
            reservations: 0,
            revenue: 0,
          };
          tenantStats.set(tenantId, {
            reservations:
              current.reservations +
              (typeof r._count === "number" ? r._count : 0),
            revenue: current.revenue + Number(r._sum?.amount ?? 0),
          });
        }
      });

      // Combinar datos
      const ranking = tenants
        .map((tenant) => {
          const stats = tenantStats.get(tenant.id) || {
            reservations: 0,
            revenue: 0,
          };
          return {
            tenantId: tenant.id,
            tenantName: tenant.displayName,
            totalFields: tenant._count.fields,
            totalUsers: tenant._count.users,
            totalReservations: stats.reservations,
            revenue: stats.revenue,
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, input.limit);

      return ranking;
    }),

  // Vista general del tenant con tendencias (comparación con período anterior) - TENANT_STAFF
  tenantOverviewWithTrends: tenantStaffProcedure
    .input(
      z
        .object({
          from: z.string().datetime().optional(),
          to: z.string().datetime().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const now = new Date();
      const currentEnd = input?.to ? new Date(input.to) : now;
      const currentStart = input?.from
        ? new Date(input.from)
        : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

      // Calcular período anterior (misma duración)
      const periodDuration = currentEnd.getTime() - currentStart.getTime();
      const previousEnd = new Date(currentStart.getTime() - 1); // 1ms before current start
      const previousStart = new Date(previousEnd.getTime() - periodDuration);

      // Función helper para obtener métricas de un período
      const getPeriodMetrics = async (startDate: Date, endDate: Date) => {
        // Contar canchas activas en el período
        const activeFields = await prisma.field.count({
          where: {
            tenantId,
            available: true,
          },
        });

        // Obtener reservas del período
        const reservations = await prisma.reservation.findMany({
          where: {
            field: { tenantId },
            startDate: { gte: startDate, lte: endDate },
          },
          select: {
            status: true,
            amount: true,
            userId: true,
          },
        });

        const totalReservations = reservations.length;
        const revenue = reservations
          .filter((r) => r.status === "CONFIRMED" || r.status === "COMPLETED")
          .reduce((sum, r) => sum + Number(r.amount), 0);

        const pendingConfirmations = reservations.filter(
          (r) => r.status === "PENDING"
        ).length;

        // Contar clientes únicos
        const uniqueClientIds = new Set(
          reservations.filter((r) => r.userId).map((r) => r.userId)
        );
        const uniqueClients = uniqueClientIds.size;

        return {
          totalReservations,
          revenue,
          activeFields,
          pendingConfirmations,
          uniqueClients,
        };
      };

      const [current, previous] = await Promise.all([
        getPeriodMetrics(currentStart, currentEnd),
        getPeriodMetrics(previousStart, previousEnd),
      ]);

      return {
        current,
        previous,
        period: {
          current: {
            from: currentStart.toISOString(),
            to: currentEnd.toISOString(),
          },
          previous: {
            from: previousStart.toISOString(),
            to: previousEnd.toISOString(),
          },
        },
      };
    }),

  // Reservas agrupadas por estado - TENANT_STAFF
  reservationsByStatus: tenantStaffProcedure
    .input(
      z
        .object({
          from: z.string().datetime().optional(),
          to: z.string().datetime().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const now = new Date();
      const endDate = input?.to ? new Date(input.to) : now;
      const startDate = input?.from
        ? new Date(input.from)
        : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const reservations = await prisma.reservation.groupBy({
        by: ["status"],
        where: {
          field: { tenantId },
          startDate: { gte: startDate, lte: endDate },
        },
        _count: true,
      });

      // Mapeo de colores por estado
      const statusColors: Record<string, string> = {
        PENDING: "var(--color-chart-4)",
        CONFIRMED: "var(--color-chart-1)",
        COMPLETED: "var(--color-chart-2)",
        CANCELLED: "var(--color-chart-5)",
        NO_SHOW: "var(--color-chart-3)",
      };

      return reservations.map((r) => ({
        status: r.status,
        count: r._count,
        color: statusColors[r.status] || "var(--color-chart-1)",
      }));
    }),

  // Reservas agrupadas por semana - TENANT_STAFF
  reservationsByWeek: tenantStaffProcedure
    .input(
      z
        .object({
          weeks: z.number().min(4).max(26).optional().default(8),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const weeks = input?.weeks ?? 8;
      const now = new Date();
      const startDate = new Date(
        now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000
      );

      const reservations = await prisma.reservation.findMany({
        where: {
          field: { tenantId },
          startDate: { gte: startDate, lte: now },
        },
        select: {
          startDate: true,
          status: true,
        },
      });

      // Agrupar por semana
      const weekMap = new Map<
        string,
        { confirmed: number; pending: number; cancelled: number }
      >();

      reservations.forEach((r) => {
        const date = new Date(r.startDate);
        // Get week start (Monday)
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(date.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);
        const weekKey = weekStart.toISOString().split("T")[0] ?? "";

        let weekData = weekMap.get(weekKey);
        if (!weekData) {
          weekData = { confirmed: 0, pending: 0, cancelled: 0 };
          weekMap.set(weekKey, weekData);
        }
        if (r.status === "CONFIRMED" || r.status === "COMPLETED") {
          weekData.confirmed += 1;
        } else if (r.status === "PENDING") {
          weekData.pending += 1;
        } else if (r.status === "CANCELLED" || r.status === "NO_SHOW") {
          weekData.cancelled += 1;
        }
      });

      // Convertir a array y ordenar por fecha
      return Array.from(weekMap.entries())
        .map(([week, data]) => ({
          week,
          confirmed: data.confirmed,
          pending: data.pending,
          cancelled: data.cancelled,
        }))
        .sort((a, b) => a.week.localeCompare(b.week));
    }),
});
