import { PaymentStatus, type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/db";
import {
  calculateOffset,
  createPaginatedResponse,
  createSearchFilter,
  createSortOrder,
  paginationInputSchema,
} from "../../lib/pagination";
import { isSysAdmin } from "../../services/rbacService";
import {
  protectedProcedure,
  router,
  tenantAdminProcedure,
  tenantStaffProcedure,
} from "../trpc";
import { requireTenantId } from "../utils/tenant";

const IdSchema = z.union([z.string().uuid(), z.string().cuid()]);

const PaymentStatusEnum = z.nativeEnum(PaymentStatus);

export const paymentRouter = router({
  // Listar pagos de las reservas del tenant (TENANT_STAFF o superior)
  list: tenantStaffProcedure
    .input(
      paginationInputSchema
        .extend({
          status: PaymentStatusEnum.optional(),
          reservationId: IdSchema.optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const {
        page = 1,
        limit = 10,
        search,
        sortBy,
        sortOrder = "desc",
        status,
        reservationId,
      } = input || {};

      const offset = calculateOffset(page, limit);
      const searchFilter = createSearchFilter(search, []);
      const orderBy = createSortOrder(sortBy, sortOrder, {
        createdAt: "createdAt",
        amount: "amount",
      });

      // SYS_ADMIN puede ver todos los pagos, otros solo los de su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);

      const whereClause: Prisma.PaymentWhereInput = {
        reservation: {
          field: {
            ...(!isSys && { tenantId }),
          },
        },
        ...(status && { status }),
        ...(reservationId && { reservationId }),
        ...searchFilter,
      };

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where: whereClause,
          include: {
            reservation: {
              select: {
                id: true,
                startDate: true,
                endDate: true,
                field: {
                  select: {
                    id: true,
                    name: true,
                    sport: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                guestName: true,
                guestEmail: true,
              },
            },
            paymentMethod: {
              select: {
                id: true,
                name: true,
                provider: true,
              },
            },
          },
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.payment.count({
          where: whereClause,
        }),
      ]);

      return createPaginatedResponse(payments, total, page, limit);
    }),

  // Obtener pago por ID (TENANT_STAFF o superior)
  getById: tenantStaffProcedure
    .input(z.object({ id: IdSchema }))
    .query(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const payment = await prisma.payment.findUnique({
        where: { id: input.id },
        include: {
          reservation: {
            include: {
              field: {
                select: {
                  id: true,
                  name: true,
                  sport: true,
                  address: true,
                  tenantId: true,
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
            },
          },
          paymentMethod: {
            select: {
              id: true,
              name: true,
              provider: true,
            },
          },
        },
      });

      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pago no encontrado",
        });
      }

      // SYS_ADMIN puede ver cualquier pago, otros solo los de su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);
      if (!isSys && payment.reservation.field.tenantId !== tenantId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver este pago",
        });
      }

      return payment;
    }),

  // Verificar pago (marcar como completado) - TENANT_STAFF o superior
  verify: tenantStaffProcedure
    .input(z.object({ id: IdSchema }))
    .mutation(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const payment = await prisma.payment.findUnique({
        where: { id: input.id },
        include: {
          reservation: {
            select: {
              id: true,
              field: {
                select: {
                  tenantId: true,
                },
              },
            },
          },
        },
      });

      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pago no encontrado",
        });
      }

      // SYS_ADMIN puede verificar cualquier pago, otros solo los de su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);
      if (!isSys && payment.reservation.field.tenantId !== tenantId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para verificar este pago",
        });
      }

      if (payment.status === "PAID") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El pago ya está verificado",
        });
      }

      const updatedPayment = await prisma.payment.update({
        where: { id: input.id },
        data: {
          status: "PAID",
        },
        include: {
          reservation: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              field: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          paymentMethod: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return updatedPayment;
    }),

  // Reembolsar pago (solo TENANT_ADMIN)
  refund: tenantAdminProcedure
    .input(z.object({ id: IdSchema }))
    .mutation(async ({ input, ctx }) => {
      const tenantId = requireTenantId(ctx.user.tenantId);

      const payment = await prisma.payment.findUnique({
        where: { id: input.id },
        include: {
          reservation: {
            select: {
              id: true,
              field: {
                select: {
                  tenantId: true,
                },
              },
            },
          },
        },
      });

      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pago no encontrado",
        });
      }

      // SYS_ADMIN puede reembolsar cualquier pago, TENANT_ADMIN solo los de su tenant
      const isSys = await isSysAdmin(ctx.user.id, tenantId);
      if (!isSys && payment.reservation.field.tenantId !== tenantId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para reembolsar este pago",
        });
      }

      if (payment.status === "REFUNDED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El pago ya fue reembolsado",
        });
      }

      if (payment.status !== "PAID") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Solo se pueden reembolsar pagos completados",
        });
      }

      const updatedPayment = await prisma.payment.update({
        where: { id: input.id },
        data: {
          status: "REFUNDED",
        },
        include: {
          reservation: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              field: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          paymentMethod: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // También actualizar el estado de la reserva a CANCELLED
      await prisma.reservation.update({
        where: { id: payment.reservationId },
        data: {
          status: "CANCELLED",
        },
      });

      return updatedPayment;
    }),

  // Obtener pagos por reserva (protectedProcedure - usuario puede ver sus propios pagos)
  getByReservation: protectedProcedure
    .input(z.object({ reservationId: IdSchema }))
    .query(async ({ input, ctx }) => {
      // Verificar que la reserva existe y que el usuario tiene permiso para verla
      const reservation = await prisma.reservation.findUnique({
        where: { id: input.reservationId },
        select: {
          id: true,
          userId: true,
          field: {
            select: {
              id: true,
              tenantId: true,
              ownerId: true,
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

      // Usuario puede ver pagos de sus propias reservas o si es staff del tenant
      const isOwnReservation = reservation.userId === ctx.user.id;
      const isSys = ctx.user.tenantId
        ? await isSysAdmin(ctx.user.id, ctx.user.tenantId)
        : false;
      const isSameTenant = reservation.field.tenantId === ctx.user.tenantId;

      if (!isOwnReservation && !isSys && !isSameTenant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver los pagos de esta reserva",
        });
      }

      const payments = await prisma.payment.findMany({
        where: {
          reservationId: input.reservationId,
        },
        include: {
          paymentMethod: {
            select: {
              id: true,
              name: true,
              provider: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return payments;
    }),
});
