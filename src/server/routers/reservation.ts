import { Prisma, ReservationStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/db";
import {
  calculateOffset,
  createPaginatedResponse,
  paginationInputSchema,
} from "../../lib/pagination";
import { isSysAdmin, isTenantAdmin } from "../../services/rbacService";
import {
  protectedProcedure,
  router,
  tenantAdminProcedure,
  tenantStaffProcedure,
} from "../trpc";
import { fieldSelectBasic, userSelectBasic } from "../utils/prisma-selects";
import { requireTenantId } from "../utils/tenant";

const IdSchema = z.union([z.string().uuid(), z.string().cuid()]);

const ReservationStatusEnum = z.nativeEnum(ReservationStatus);

export const reservationRouter = router({
  /** Lista reservas de todas las canchas del tenant (TENANT_STAFF o superior) */
  listForTenant: tenantStaffProcedure
    .input(
      paginationInputSchema
        .extend({
          status: ReservationStatusEnum.optional(),
          fieldId: IdSchema.optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const { page = 1, limit = 10, status, fieldId } = input ?? {};
      const offset = calculateOffset(page, limit);

      // SYS_ADMIN puede ver reservas de todos los tenants, otros solo su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);

      const where = {
        field: {
          ...(!isSys && { tenantId }),
          ...(fieldId && { id: fieldId }),
        },
        ...(status && { status }),
      };

      const [reservations, total] = await Promise.all([
        prisma.reservation.findMany({
          where,
          include: {
            field: { select: fieldSelectBasic },
            user: { select: userSelectBasic },
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

  /** Próximas reservas del tenant (para widget owner dashboard) */
  getUpcomingForOwner: tenantStaffProcedure
    .input(
      z.object({ limit: z.number().int().positive().optional() }).optional()
    )
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);
      const limit = input?.limit ?? 5;
      const isSys = await isSysAdmin(ctx.user.id, tenantId);
      const now = new Date();
      const reservations = await prisma.reservation.findMany({
        where: {
          field: {
            ...(!isSys && { tenantId }),
          },
          startDate: { gte: now },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        include: {
          field: { select: { id: true, name: true } },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { startDate: "asc" },
        take: limit,
      });
      return reservations;
    }),

  /** Cantidad de reservas PENDING del tenant (para alerta owner dashboard) */
  getOwnerPendingCount: tenantStaffProcedure.query(async ({ ctx }) => {
    const tenantId = requireTenantId(ctx.user.tenantId);
    const isSys = await isSysAdmin(ctx.user.id, tenantId);
    return prisma.reservation.count({
      where: {
        field: {
          ...(!isSys && { tenantId }),
        },
        status: "PENDING",
      },
    });
  }),

  /** Mis reservas como cliente (protectedProcedure) */
  myReservations: protectedProcedure
    .input(
      paginationInputSchema
        .extend({
          status: ReservationStatusEnum.optional(),
          startDate: z.string().datetime().optional(),
          endDate: z.string().datetime().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const { page = 1, limit = 10, status, startDate, endDate } = input ?? {};
      const offset = calculateOffset(page, limit);

      const where = {
        OR: [
          { userId: ctx.user.id }, // Reservas del usuario autenticado
          { guestEmail: ctx.user.email }, // Reservas como invitado con mismo email
        ],
        ...(status && { status }),
        ...(startDate && { startDate: { gte: new Date(startDate) } }),
        ...(endDate && { endDate: { lte: new Date(endDate) } }),
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
                sportCenter: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            payments: {
              select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
              },
            },
          },
          orderBy: { startDate: "desc" },
          skip: offset,
          take: limit,
        }),
        prisma.reservation.count({ where }),
      ]);

      return createPaginatedResponse(reservations, total, page, limit);
    }),

  /** Lista todas las reservas del tenant (TENANT_ADMIN o superior) - Alias for backward compatibility */
  listForAdmin: tenantAdminProcedure
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
      const tenantId = requireTenantId(ctx.user.tenantId);

      const { page = 1, limit = 10, status, fieldId, ownerId } = input ?? {};
      const offset = calculateOffset(page, limit);

      // SYS_ADMIN puede ver reservas de todos los tenants
      const isSys = await isSysAdmin(ctx.user.id, tenantId);

      const where = {
        field: {
          ...(!isSys && { tenantId }),
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

  /** Lista reservas de un usuario (cliente) por userId - TENANT_STAFF o superior */
  listByUser: tenantStaffProcedure
    .input(paginationInputSchema.extend({ userId: IdSchema }).optional())
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);
      if (!input?.userId) {
        return createPaginatedResponse([], 0, 1, 10);
      }

      const { page = 1, limit = 100, userId } = input;
      const offset = calculateOffset(page, limit);
      const isSys = await isSysAdmin(ctx.user.id, tenantId);

      const where = {
        userId,
        field: {
          ...(!isSys && { tenantId }),
        },
      };

      const [reservations, total] = await Promise.all([
        prisma.reservation.findMany({
          where,
          include: {
            field: { select: fieldSelectBasic },
            payments: {
              select: {
                id: true,
                amount: true,
                status: true,
                createdAt: true,
              },
            },
          },
          orderBy: { startDate: "desc" },
          skip: offset,
          take: limit,
        }),
        prisma.reservation.count({ where }),
      ]);

      return createPaginatedResponse(reservations, total, page, limit);
    }),

  /** Obtener una reserva por ID con todos los detalles (tenant staff o dueño de la reserva) */
  getById: protectedProcedure
    .input(z.object({ id: IdSchema }))
    .query(async ({ input, ctx }) => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: input.id },
        include: {
          field: {
            select: {
              id: true,
              name: true,
              sport: true,
              address: true,
              department: true,
              district: true,
              tenantId: true,
              ownerId: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
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

      // Usuario puede ver sus propias reservas o si es staff del tenant
      const isOwnReservation = reservation.userId === ctx.user.id;
      const isSys = ctx.user.tenantId
        ? await isSysAdmin(ctx.user.id, ctx.user.tenantId)
        : false;
      const isSameTenant = reservation.field.tenantId === ctx.user.tenantId;

      if (!isOwnReservation && !isSys && !isSameTenant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para ver esta reserva",
        });
      }

      return reservation;
    }),

  /** Slots disponibles de 1h para una cancha en una fecha (protectedProcedure - cualquier usuario) */
  getAvailableSlots: protectedProcedure
    .input(
      z.object({
        fieldId: IdSchema,
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato fecha: YYYY-MM-DD"),
      })
    )
    .query(async ({ input }) => {
      const field = await prisma.field.findUnique({
        where: { id: input.fieldId },
        select: {
          id: true,
          tenantId: true,
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

      const [startH = 0, startM = 0] = startHour.split(":").map(Number);
      const [endH = 0, endM = 0] = endHour.split(":").map(Number);
      const dayStart = new Date(date);
      dayStart.setHours(startH, startM, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(endH, endM, 0, 0);

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

  /** Crear reserva manual (TENANT_STAFF o superior). Monto se calcula automáticamente: precio cancha × horas. */
  createManual: tenantStaffProcedure
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
      const tenantId = requireTenantId(ctx.user.tenantId);

      const field = await prisma.field.findUnique({
        where: { id: input.fieldId },
        select: {
          id: true,
          price: true,
          tenantId: true,
        },
      });

      if (!field) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cancha no encontrada",
        });
      }

      // SYS_ADMIN puede crear reservas en cualquier cancha, otros solo en su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);
      if (!isSys && field.tenantId !== tenantId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para crear reservas en esta cancha",
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
          tenantId: field.tenantId,
          userId: input.userId ?? null,
          guestName: isGuest ? (input.guestName?.trim() ?? null) : null,
          guestEmail: isGuest ? (input.guestEmail?.trim() ?? null) : null,
          guestPhone: isGuest ? (input.guestPhone?.trim() ?? null) : null,
        },
        include: {
          field: { select: fieldSelectBasic },
          user: { select: userSelectBasic },
          _count: { select: { payments: true } },
        },
      });

      return reservation;
    }),

  /** Actualizar estado de una reserva (confirmar o cancelar). TENANT_STAFF o superior. */
  updateStatus: tenantStaffProcedure
    .input(
      z.object({
        id: IdSchema,
        status: z.enum([
          ReservationStatus.CONFIRMED,
          ReservationStatus.CANCELLED,
          ReservationStatus.COMPLETED,
          ReservationStatus.NO_SHOW,
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const reservation = await prisma.reservation.findUnique({
        where: { id: input.id },
        include: {
          field: {
            select: {
              id: true,
              tenantId: true,
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

      // SYS_ADMIN puede modificar cualquier reserva, otros solo las de su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);
      if (!isSys && reservation.field.tenantId !== tenantId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permiso para modificar esta reserva",
        });
      }

      const updated = await prisma.reservation.update({
        where: { id: input.id },
        data: { status: input.status },
        include: {
          field: { select: fieldSelectBasic },
          user: { select: userSelectBasic },
          _count: { select: { payments: true } },
        },
      });

      return updated;
    }),
});
