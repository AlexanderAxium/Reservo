"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/hooks/useTRPC";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/lib/utils";
import type { PaymentStatus } from "@prisma/client";
import { ArrowLeft, CheckCircle2, CreditCard, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function PaymentDetailPage() {
  const params = useParams();
  const { t } = useTranslation("dashboard");
  const paymentId = params.id as string;

  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);

  const STATUS_LABELS: Record<PaymentStatus, string> = {
    PENDING: t("statuses.pending"),
    PAID: t("statuses.paid"),
    CANCELLED: t("statuses.cancelled"),
    REFUNDED: t("statuses.refunded"),
    FAILED: t("statuses.failed"),
  };

  const {
    data: payment,
    isLoading,
    refetch,
  } = trpc.payment.getById.useQuery({
    id: paymentId,
  });

  const verifyMutation = trpc.payment.verify.useMutation({
    onSuccess: () => {
      toast.success(t("paymentDetail.paymentVerified"));
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || t("paymentDetail.verifyError"));
    },
  });

  const refundMutation = trpc.payment.refund.useMutation({
    onSuccess: () => {
      toast.success(t("paymentDetail.refundProcessed"));
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || t("paymentDetail.refundError"));
    },
  });

  const handleVerify = () => {
    setVerifyDialogOpen(false);
    verifyMutation.mutate({ id: paymentId });
  };

  const handleRefund = () => {
    setRefundDialogOpen(false);
    refundMutation.mutate({ id: paymentId });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          {t("paymentDetail.loadingPayment")}
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-6">
        <div className="text-center py-8">{t("paymentDetail.notFound")}</div>
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
            {t("paymentDetail.back")}
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {t("paymentDetail.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("paymentDetail.description")}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t("paymentDetail.paymentInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("paymentDetail.amount")}
              </p>
              <p className="text-2xl font-bold">
                S/ {formatPrice(Number(payment.amount))}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("paymentDetail.statusLabel")}
              </p>
              <Badge variant="outline" className="mt-1">
                {STATUS_LABELS[payment.status as PaymentStatus] ||
                  payment.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("paymentDetail.paymentMethod")}
              </p>
              <p className="text-base">{payment.paymentMethod?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("paymentDetail.date")}
              </p>
              <p className="text-base">
                {new Date(payment.createdAt as string).toLocaleDateString(
                  "es-PE",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("paymentDetail.relatedReservation")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("paymentDetail.client")}
            </p>
            <p className="text-base">
              {payment.reservation.user?.name ||
                payment.reservation.guestName ||
                t("paymentDetail.guest")}
            </p>
            <p className="text-sm text-muted-foreground">
              {payment.reservation.user?.email ||
                payment.reservation.guestEmail ||
                "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("paymentDetail.field")}
            </p>
            <p className="text-base">{payment.reservation.field.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("paymentDetail.dateTime")}
            </p>
            <p className="text-base">
              {new Date(
                payment.reservation.startDate as string
              ).toLocaleDateString("es-PE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(
                payment.reservation.startDate as string
              ).toLocaleTimeString("es-PE", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              {t("paymentDetail.timeSeparator")}{" "}
              {new Date(
                payment.reservation.endDate as string
              ).toLocaleTimeString("es-PE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {canVerify && (
          <Button
            onClick={() => setVerifyDialogOpen(true)}
            disabled={verifyMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {verifyMutation.isPending
              ? t("paymentDetail.verifying")
              : t("paymentDetail.verifyPayment")}
          </Button>
        )}
        {canRefund && (
          <Button
            onClick={() => setRefundDialogOpen(true)}
            disabled={refundMutation.isPending}
            variant="destructive"
          >
            <XCircle className="h-4 w-4 mr-2" />
            {refundMutation.isPending
              ? t("paymentDetail.processing")
              : t("paymentDetail.refund")}
          </Button>
        )}
      </div>

      <AlertDialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("paymentDetail.verifyTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("paymentDetail.confirmVerify")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerify}>
              {t("paymentDetail.verifyPayment")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("paymentDetail.refundTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("paymentDetail.confirmRefund")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRefund}>
              {t("paymentDetail.refund")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
