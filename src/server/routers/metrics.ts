import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/db";
import { isSysAdmin } from "../../services/rbacService";
import { router, sysAdminProcedure, tenantAdminProcedure } from "../trpc";

const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const metricsRouter = router({
  // Vista general del tenant (KPIs para dashboard) - TENANT_ADMIN
  tenantOverview: tenantAdminProcedure
    .input(dateRangeSchema.optional())
    .query(async ({ input, ctx }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      const now = new Date();
      const startDate = input?.startDate
        ? new Date(input.startDate)
        : new Date(now.getFullYear(), now.getMonth(), 1); // Primer día del mes
      const endDate = input?.endDate
        ? new Date(input.endDate)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // Último día del mes

      // Solo puede ver métricas de su propio tenant (SYS_ADMIN puede ver cualquiera)
      const isSys = await isSysAdmin(ctx.user.id, ctx.user.tenantId);
      const tenantId = isSys ? ctx.user.tenantId : ctx.user.tenantId;

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

  // Ingresos por período - TENANT_ADMIN
  revenue: tenantAdminProcedure
    .input(
      dateRangeSchema.extend({
        groupBy: z.enum(["day", "week", "month"]).optional().default("day"),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      const now = new Date();
      const startDate = input.startDate
        ? new Date(input.startDate)
        : new Date(now.getFullYear(), now.getMonth() - 2, 1); // Últimos 3 meses
      const endDate = input.endDate ? new Date(input.endDate) : now;

      const isSys = await isSysAdmin(ctx.user.id, ctx.user.tenantId);
      const tenantId = isSys ? ctx.user.tenantId : ctx.user.tenantId;

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
      if (!ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario sin tenant asignado",
        });
      }

      const now = new Date();
      const startDate = input?.startDate
        ? new Date(input.startDate)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = input?.endDate
        ? new Date(input.endDate)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      const isSys = await isSysAdmin(ctx.user.id, ctx.user.tenantId);
      const tenantId = isSys ? ctx.user.tenantId : ctx.user.tenantId;

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
});
