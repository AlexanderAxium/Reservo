import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/db";
import {
  calculateOffset,
  createPaginatedResponse,
  paginationInputSchema,
} from "../../lib/pagination";
import { hasRole, isAdmin } from "../../services/rbacService";
import { protectedProcedure, router } from "../trpc";

const IdSchema = z.union([z.string().uuid(), z.string().cuid()]);

const ReservationStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
]);

export const reservationRouter = router({
  /** Lista reservas de las canchas del owner (solo owner) */
  listForOwner: protectedProcedure
    .input(
      paginationInputSchema
        .extend({
          status: ReservationStatusEnum.optional(),
          fieldId: IdSchema.optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }
      const isOwner = await hasRole(ctx.user.id, "owner", ctx.user.tenantId);
      if (!isOwner) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Solo los dueños de canchas pueden ver sus reservas",
        });
      }

      const { page = 1, limit = 10, status, fieldId } = input ?? {};
      const offset = calculateOffset(page, limit);

      const where = {
        field: {
          ownerId: ctx.user.id,
          ...(fieldId && { id: fieldId }),
        },
        ...(status && { status }),
      };

      const [reservations, total] = await Promise.all([
        prisma.reservation.findMany({
          where,
          include: {
            field: {
              select: {
                id: true,
                name: true,
                sport: true,
                address: true,
                district: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: { select: { payments: true } },
          },
          orderBy: { startDate: "desc" },
          skip: offset,
          take: limit,
        }),
        prisma.reservation.count({ where }),
      ]);

      return createPaginatedResponse(reservations, total, page, limit);
    }),

  /** Estadísticas del mes para el owner (reservas e ingresos). */
  getOwnerStats: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id || !ctx.user.tenantId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuario no autenticado",
      });
    }
    const isOwner = await hasRole(ctx.user.id, "owner", ctx.user.tenantId);
    if (!isOwner) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Solo los dueños de canchas pueden ver estas estadísticas",
      });
    }
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    const where = {
      field: { ownerId: ctx.user.id },
      startDate: { gte: startOfMonth, lte: endOfMonth },
    };
    const [monthlyReservations, revenueResult] = await Promise.all([
      prisma.reservation.count({ where }),
      prisma.reservation.aggregate({
        where: {
          ...where,
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
        _sum: { amount: true },
      }),
    ]);
    const monthlyRevenue = Number(revenueResult._sum.amount ?? 0);
    return { monthlyReservations, monthlyRevenue };
  }),

  /** Próximas reservas del owner (hoy en adelante, orden por fecha). */
  getUpcomingForOwner: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(20).optional() }).optional())
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }
      const isOwner = await hasRole(ctx.user.id, "owner", ctx.user.tenantId);
      if (!isOwner) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Solo los dueños de canchas pueden ver sus reservas",
        });
      }
      const limit = input?.limit ?? 5;
      const reservations = await prisma.reservation.findMany({
        where: {
          field: { ownerId: ctx.user.id },
          startDate: { gte: new Date() },
          status: { notIn: ["CANCELLED"] },
        },
        include: {
          field: { select: { id: true, name: true, sport: true } },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { startDate: "asc" },
        take: limit,
      });
      return reservations;
    }),

  /** Cantidad de reservas pendientes de confirmar (owner). */
  getOwnerPendingCount: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id || !ctx.user.tenantId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuario no autenticado",
      });
    }
    const isOwner = await hasRole(ctx.user.id, "owner", ctx.user.tenantId);
    if (!isOwner) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Solo los dueños de canchas pueden ver este dato",
      });
    }
    return prisma.reservation.count({
      where: {
        field: { ownerId: ctx.user.id },
        status: "PENDING",
      },
    });
  }),

  /** Ingresos y cantidad de reservas por cancha (solo CONFIRMED/COMPLETED). Incluye total y mes actual. */
  getOwnerRevenueByField: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id || !ctx.user.tenantId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Usuario no autenticado",
      });
    }
    const isOwner = await hasRole(ctx.user.id, "owner", ctx.user.tenantId);
    if (!isOwner) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Solo los dueños de canchas pueden ver estas métricas",
      });
    }
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const [fields, totalByField, monthlyByField] = await Promise.all([
      prisma.field.findMany({
        where: { ownerId: ctx.user.id },
        select: { id: true, name: true, sport: true },
        orderBy: { name: "asc" },
      }),
      prisma.reservation.groupBy({
        by: ["fieldId"],
        where: {
          field: { ownerId: ctx.user.id },
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.reservation.groupBy({
        by: ["fieldId"],
        where: {
          field: { ownerId: ctx.user.id },
          status: { in: ["CONFIRMED", "COMPLETED"] },
          startDate: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const totalMap = new Map(
      totalByField.map((r) => [
        r.fieldId,
        { revenue: Number(r._sum.amount ?? 0), count: r._count },
      ])
    );
    const monthlyMap = new Map(
      monthlyByField.map((r) => [
        r.fieldId,
        { revenue: Number(r._sum.amount ?? 0), count: r._count },
      ])
    );

    return fields.map((field) => {
      const total = totalMap.get(field.id) ?? { revenue: 0, count: 0 };
      const monthly = monthlyMap.get(field.id) ?? { revenue: 0, count: 0 };
      return {
        fieldId: field.id,
        fieldName: field.name,
        sport: field.sport,
        totalRevenue: total.revenue,
        totalReservations: total.count,
        monthlyRevenue: monthly.revenue,
        monthlyReservations: monthly.count,
      };
    });
  }),

  /** Lista todas las reservas del tenant (admin / super admin) */
  listForAdmin: protectedProcedure
    .input(
      paginationInputSchema
        .extend({
          status: ReservationStatusEnum.optional(),
          fieldId: IdSchema.optional(),
          ownerId: IdSchema.optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }
      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);
      if (!userIsAdmin) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Solo administradores pueden ver todas las reservas",
        });
      }

      const { page = 1, limit = 10, status, fieldId, ownerId } = input ?? {};
      const offset = calculateOffset(page, limit);

      const where = {
        field: {
          owner: { tenantId: ctx.user.tenantId },
          ...(fieldId && { id: fieldId }),
          ...(ownerId && { ownerId }),
        },
        ...(status && { status }),
      };

      const [reservations, total] = await Promise.all([
        prisma.reservation.findMany({
          where,
          include: {
            field: {
              select: {
                id: true,
                name: true,
                sport: true,
                address: true,
                district: true,
                ownerId: true,
                owner: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: { select: { payments: true } },
          },
          orderBy: { startDate: "desc" },
          skip: offset,
          take: limit,
        }),
        prisma.reservation.count({ where }),
      ]);

      return createPaginatedResponse(reservations, total, page, limit);
    }),

  /** Obtener una reserva por ID con todos los detalles. Owner de la cancha o admin. */
  getById: protectedProcedure
    .input(z.object({ id: IdSchema }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      const reservation = await prisma.reservation.findUnique({
        where: { id: input.id },
        include: {
          field: {
            select: {
              id: true,
              name: true,
              sport: true,
              address: true,
              district: true,
              city: true,
              ownerId: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  tenantId: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true,
              paymentMethod: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!reservation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reserva no encontrada",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);
      const isOwnerOfField = reservation.field.ownerId === ctx.user.id;
      const sameTenant = reservation.field.owner.tenantId === ctx.user.tenantId;

      if (!userIsAdmin && !isOwnerOfField) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para ver esta reserva",
        });
      }
      if (userIsAdmin && !sameTenant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "La reserva no pertenece a tu tenant",
        });
      }

      return reservation;
    }),

  /** Slots disponibles de 1h para una cancha en una fecha (excluye horas ya ocupadas). */
  getAvailableSlots: protectedProcedure
    .input(
      z.object({
        fieldId: IdSchema,
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato fecha: YYYY-MM-DD"),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      const field = await prisma.field.findUnique({
        where: { id: input.fieldId },
        select: {
          id: true,
          ownerId: true,
          owner: { select: { tenantId: true } },
          schedules: {
            select: { day: true, startHour: true, endHour: true },
          },
        },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);
      const isOwnerOfField = field.ownerId === ctx.user.id;
      const sameTenant = field.owner.tenantId === ctx.user.tenantId;
      if (!userIsAdmin && !isOwnerOfField) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para ver disponibilidad de esta cancha",
        });
      }
      if (userIsAdmin && !sameTenant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "La cancha no pertenece a tu tenant",
        });
      }

      const date = new Date(`${input.date}T12:00:00`);
      const dayOfWeek = date.getDay();
      const weekDayMap = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ] as const;
      const weekDay = weekDayMap[dayOfWeek] ?? "SUNDAY";

      const schedule = field.schedules.find((s) => s.day === weekDay);
      const startHour = schedule?.startHour ?? "08:00";
      const endHour = schedule?.endHour ?? "22:00";

      const [startH, startM] = startHour.split(":").map(Number);
      const [endH, endM] = endHour.split(":").map(Number);
      const dayStart = new Date(date);
      dayStart.setHours(startH, startM ?? 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(endH, endM ?? 0, 0, 0);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      if (date < todayStart) {
        return [];
      }
      const now = new Date();
      if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      ) {
        if (dayStart < now) {
          dayStart.setTime(now.getTime());
          dayStart.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0);
        }
      }

      const reservations = await prisma.reservation.findMany({
        where: {
          fieldId: input.fieldId,
          status: { not: "CANCELLED" },
          OR: [
            {
              startDate: { lt: dayEnd },
              endDate: { gt: dayStart },
            },
          ],
        },
        select: { startDate: true, endDate: true },
      });

      const pad = (n: number) => String(n).padStart(2, "0");
      const slotDurationMs = 60 * 60 * 1000;
      const slots: {
        startLocal: string;
        endLocal: string;
        label: string;
        available: boolean;
      }[] = [];
      let slotStart = new Date(dayStart);

      while (slotStart.getTime() + slotDurationMs <= dayEnd.getTime()) {
        const slotEnd = new Date(slotStart.getTime() + slotDurationMs);
        const overlaps = reservations.some(
          (r) =>
            slotEnd.getTime() > new Date(r.startDate).getTime() &&
            slotStart.getTime() < new Date(r.endDate).getTime()
        );
        const startStr = `${input.date}T${pad(slotStart.getHours())}:${pad(slotStart.getMinutes())}`;
        const endStr = `${input.date}T${pad(slotEnd.getHours())}:${pad(slotEnd.getMinutes())}`;
        slots.push({
          startLocal: startStr,
          endLocal: endStr,
          label: `${pad(slotStart.getHours())}:${pad(slotStart.getMinutes())} - ${pad(slotEnd.getHours())}:${pad(slotEnd.getMinutes())}`,
          available: !overlaps,
        });
        slotStart = new Date(slotStart.getTime() + slotDurationMs);
      }

      return slots;
    }),

  /** Crear reserva manual (admin o owner de la cancha). Monto se calcula automáticamente: precio cancha × horas (1 o 2). */
  createManual: protectedProcedure
    .input(
      z.object({
        fieldId: IdSchema,
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        amount: z.number().nonnegative().optional(),
        userId: IdSchema.optional(),
        guestName: z.string().min(1).optional(),
        guestEmail: z.string().email().optional(),
        guestPhone: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      const field = await prisma.field.findUnique({
        where: { id: input.fieldId },
        select: {
          id: true,
          price: true,
          ownerId: true,
          owner: { select: { tenantId: true } },
        },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);
      const isOwnerOfField = field.ownerId === ctx.user.id;
      const sameTenant = field.owner.tenantId === ctx.user.tenantId;

      if (!userIsAdmin && !isOwnerOfField) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para crear reservas en esta cancha",
        });
      }
      if (userIsAdmin && !sameTenant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "La cancha no pertenece a tu tenant",
        });
      }

      const isGuest = !input.userId;
      if (isGuest) {
        if (
          !input.guestName?.trim() ||
          !input.guestEmail?.trim() ||
          !input.guestPhone?.trim()
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Para reserva sin usuario registrado debes indicar nombre, email y teléfono del invitado",
          });
        }
      }

      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);
      if (startDate >= endDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "La hora de fin debe ser posterior a la de inicio",
        });
      }

      const durationMs = endDate.getTime() - startDate.getTime();
      const durationHours = Math.max(
        0.5,
        Math.round((durationMs / (60 * 60 * 1000)) * 100) / 100
      );
      const pricePerHour = Number(field.price);
      const amount = Math.round(pricePerHour * durationHours * 100) / 100;

      const overlapping = await prisma.reservation.count({
        where: {
          fieldId: input.fieldId,
          status: { in: ["PENDING", "CONFIRMED"] },
          OR: [
            {
              startDate: { lt: endDate },
              endDate: { gt: startDate },
            },
          ],
        },
      });
      if (overlapping > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El horario seleccionado ya está ocupado",
        });
      }

      const reservation = await prisma.reservation.create({
        data: {
          fieldId: input.fieldId,
          startDate,
          endDate,
          amount: new Prisma.Decimal(amount),
          status: "PENDING",
          userId: input.userId ?? null,
          guestName: isGuest ? (input.guestName?.trim() ?? null) : null,
          guestEmail: isGuest ? (input.guestEmail?.trim() ?? null) : null,
          guestPhone: isGuest ? (input.guestPhone?.trim() ?? null) : null,
        },
        include: {
          field: {
            select: {
              id: true,
              name: true,
              sport: true,
              address: true,
              district: true,
            },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
          _count: { select: { payments: true } },
        },
      });

      return reservation;
    }),

  /** Actualizar estado de una reserva (confirmar o cancelar). Owner de la cancha o admin. */
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: IdSchema,
        status: z.enum(["CONFIRMED", "CANCELLED"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id || !ctx.user.tenantId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Usuario no autenticado",
        });
      }

      const reservation = await prisma.reservation.findUnique({
        where: { id: input.id },
        include: {
          field: {
            select: {
              id: true,
              ownerId: true,
              owner: { select: { tenantId: true } },
            },
          },
        },
      });

      if (!reservation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reserva no encontrada",
        });
      }

      const userIsAdmin = await isAdmin(ctx.user.id, ctx.user.tenantId);
      const isOwnerOfField = reservation.field.ownerId === ctx.user.id;
      const sameTenant = reservation.field.owner.tenantId === ctx.user.tenantId;

      if (!userIsAdmin && !isOwnerOfField) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para modificar esta reserva",
        });
      }
      if (userIsAdmin && !sameTenant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "La reserva no pertenece a tu tenant",
        });
      }

      const updated = await prisma.reservation.update({
        where: { id: input.id },
        data: { status: input.status },
        include: {
          field: {
            select: {
              id: true,
              name: true,
              sport: true,
              address: true,
              district: true,
            },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
          _count: { select: { payments: true } },
        },
      });

      return updated;
    }),
});
