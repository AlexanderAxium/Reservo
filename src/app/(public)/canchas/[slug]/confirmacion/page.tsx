"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/lib/utils";
import { parse } from "date-fns";
import { format } from "date-fns";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function ConfirmacionPage() {
  const { t } = useTranslation("fields");
  const { t: tCommon } = useTranslation("common");
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();

  const slug = params.slug as string;
  const reservationId = searchParams.get("id");
  const fieldName = searchParams.get("field");
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const amountParam = searchParams.get("amount");

  // Parse data from query params
  const selectedDate = dateParam
    ? parse(dateParam, "yyyy-MM-dd", new Date())
    : null;
  const timeSlots = timeParam ? timeParam.split(",") : [];
  const totalAmount = amountParam ? Number.parseFloat(amountParam) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3 text-sm text-foreground/80">
          <Link href="/" className="hover:text-teal-600 transition-colors">
            {tCommon("home")}
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-1" />
          <Link
            href="/canchas"
            className="hover:text-teal-600 transition-colors"
          >
            {tCommon("fields")}
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-1" />
          <Link
            href={`/canchas/${slug}`}
            className="hover:text-teal-600 transition-colors"
          >
            {fieldName ?? "Cancha"}
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-1" />
          <span className="text-foreground">{t("confirmationTitle")}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 mb-4">
              <CheckCircle className="h-10 w-10 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("confirmationTitle")}
            </h1>
            <p className="text-lg text-foreground/70">
              {t("confirmationDescription")}
            </p>
            {reservationId && (
              <p className="text-sm text-muted-foreground mt-2">
                {t("reservationId")}
                {reservationId}
              </p>
            )}
          </div>

          {/* Reservation details card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t("reservationSummary")}</CardTitle>
              <CardDescription>{fieldName ?? "—"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">{t("date")}</p>
                    <p className="font-medium text-foreground">
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">{t("time")}</p>
                    <p className="font-medium text-foreground">
                      {timeSlots.length > 0
                        ? `${timeSlots[0]} - ${timeSlots[timeSlots.length - 1]}:00`
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">{t("total")}</p>
                    <p className="font-medium text-foreground text-lg">
                      S/ {formatPrice(totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">
                      {t("paymentMethod")}
                    </p>
                    <p className="font-medium text-foreground">
                      {t("paymentPresencial")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's next section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t("whatsNext")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {t("whatsNextStep1")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {t("whatsNextStep2")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {t("whatsNextStep3")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create account CTA (only for guests) */}
          {!user && (
            <Card className="mb-8 border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/20 dark:to-background">
              <CardHeader>
                <CardTitle className="text-teal-600 dark:text-teal-400">
                  {t("createAccountCTA")}
                </CardTitle>
                <CardDescription>
                  {t("createAccountDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/signup">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    {t("createAccount")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/canchas/${slug}`}>
              <Button variant="outline" size="lg">
                {t("backToField")}
              </Button>
            </Link>
            <Link href="/canchas">
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white"
                size="lg"
              >
                {t("backToFields")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
