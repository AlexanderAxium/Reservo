"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/hooks/useTRPC";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, CreditCard, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export default function PaymentDetailPage() {
  const params = useParams();
  const paymentId = params.id as string;

  const {
    data: payment,
    isLoading,
    refetch,
  } = trpc.payment.getById.useQuery({
    id: paymentId,
  });

  const verifyMutation = trpc.payment.verify.useMutation({
    onSuccess: () => {
      toast.success("Pago verificado correctamente");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al verificar pago");
    },
  });

  const refundMutation = trpc.payment.refund.useMutation({
    onSuccess: () => {
      toast.success("Reembolso procesado correctamente");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al procesar reembolso");
    },
  });

  const handleVerify = () => {
    if (confirm("¿Confirmar que este pago ha sido recibido?")) {
      verifyMutation.mutate({ id: paymentId });
    }
  };

  const handleRefund = () => {
    if (confirm("¿Estás seguro de procesar este reembolso?")) {
      refundMutation.mutate({ id: paymentId });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Cargando...</div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Pago no encontrado</div>
      </div>
    );
  }

  const canVerify = payment.status === "PENDING";
  const canRefund = payment.status === "PAID";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/payments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Detalle del Pago
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Información completa de la transacción
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Información del Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monto</p>
              <p className="text-2xl font-bold">
                S/ {formatPrice(Number(payment.amount))}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Estado
              </p>
              <Badge variant="outline" className="mt-1">
                {STATUS_LABELS[payment.status] || payment.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Método de Pago
              </p>
              <p className="text-base">{payment.paymentMethod?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha</p>
              <p className="text-base">
                {new Date(payment.createdAt).toLocaleDateString("es-PE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reserva Asociada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cliente</p>
            <p className="text-base">
              {payment.reservation.user?.name ||
                payment.reservation.guestName ||
                "Invitado"}
            </p>
            <p className="text-sm text-muted-foreground">
              {payment.reservation.user?.email ||
                payment.reservation.guestEmail ||
                "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cancha</p>
            <p className="text-base">{payment.reservation.field.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Fecha y Hora
            </p>
            <p className="text-base">
              {new Date(payment.reservation.startDate).toLocaleDateString(
                "es-PE",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}{" "}
              -{" "}
              {new Date(payment.reservation.startDate).toLocaleTimeString(
                "es-PE",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}{" "}
              a{" "}
              {new Date(payment.reservation.endDate).toLocaleTimeString(
                "es-PE",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {canVerify && (
          <Button
            onClick={handleVerify}
            disabled={verifyMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {verifyMutation.isPending ? "Verificando..." : "Verificar Pago"}
          </Button>
        )}
        {canRefund && (
          <Button
            onClick={handleRefund}
            disabled={refundMutation.isPending}
            variant="destructive"
          >
            <XCircle className="h-4 w-4 mr-2" />
            {refundMutation.isPending ? "Procesando..." : "Reembolsar"}
          </Button>
        )}
      </div>
    </div>
  );
}
