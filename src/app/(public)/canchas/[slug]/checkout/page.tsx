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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import {
  Calendar,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const guestFormSchema = z.object({
  guestName: z.string().min(1, "El nombre es requerido"),
  guestEmail: z.string().email("Email inválido"),
  guestPhone: z.string().min(1, "El teléfono es requerido"),
});

type GuestFormData = z.infer<typeof guestFormSchema>;

type PaymentMethod = "presencial" | "transferencia" | "otro";

export default function CheckoutPage() {
  const { t } = useTranslation("fields");
  const { t: tCommon } = useTranslation("common");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthContext();

  const slug = params.slug as string;
  const date = searchParams.get("date");
  const slotsParam = searchParams.get("slots");

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("presencial");

  // Parse date and slots
  const selectedDate = date ? parse(date, "yyyy-MM-dd", new Date()) : null;
  const selectedSlots = slotsParam ? slotsParam.split(",") : [];

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      guestName: user?.name ?? "",
      guestEmail: user?.email ?? "",
      guestPhone: user?.phone ?? "",
    },
  });

  // Fetch field data
  const { data: field, isLoading } = trpc.field.getBySlugPublic.useQuery(
    { slug },
    { enabled: !!slug }
  );

  // Create reservation mutation
  const createReservation = trpc.field.createReservation.useMutation({
    onSuccess: (data) => {
      toast.success(t("reservationSuccess"));
      // Redirect to confirmation page with reservation details
      const confirmationUrl = `/canchas/${slug}/confirmacion?id=${data.id}&field=${encodeURIComponent(field?.name ?? "")}&date=${date ?? ""}&time=${selectedSlots.join(",")}&amount=${totalWithService.toFixed(2)}`;
      router.push(confirmationUrl);
    },
    onError: (err) => {
      toast.error(err.message || t("reservationError"));
    },
  });

  // Validate checkout params
  const isValidCheckout = !!selectedDate && selectedSlots.length > 0 && !!field;

  // Calculate totals
  const totalHours = selectedSlots.length;
  const totalAmount = field ? Number(field.price) * totalHours : 0;
  const SERVICE_CHARGE = 2.0;
  const totalWithService = totalAmount + SERVICE_CHARGE;

  // Handle reservation submission
  const handleReservation = (data?: GuestFormData) => {
    if (!field || !selectedDate) return;

    const startDate = new Date(selectedDate);
    const [h = 0, m = 0] = (selectedSlots[0] ?? "00:00").split(":").map(Number);
    startDate.setHours(h, m, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + totalHours, 0, 0, 0);

    createReservation.mutate({
      fieldId: field.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      amount: totalAmount,
      ...(data && {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
      }),
    });
  };

  const onSubmitGuest = (data: GuestFormData) => {
    handleReservation(data);
  };

  const onSubmitUser = () => {
    handleReservation();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!field || !isValidCheckout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {!field ? t("fieldNotAvailable") : t("invalidCheckoutParams")}
          </h1>
          <Link href="/canchas">
            <Button variant="outline">{t("backToFields")}</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            {field.name}
          </Link>
          <ChevronRight className="inline h-4 w-4 mx-1" />
          <span className="text-foreground">{t("checkout")}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("checkoutTitle")}
          </h1>
          <p className="text-foreground/70">{t("checkoutDescription")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Contact info + Payment method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("yourContactInfo")}</CardTitle>
                {!user && (
                  <CardDescription>
                    {t("loginForFaster")}{" "}
                    <Link
                      href="/signin"
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      {t("loginLink")}
                    </Link>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {user ? (
                  // Logged in user - read-only
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-muted/30 p-4 grid grid-cols-1 gap-3">
                      <div>
                        <p className="text-sm text-foreground/70 mb-1">
                          {t("guestName")}
                        </p>
                        <p className="font-medium text-foreground">
                          {user.name ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/70 mb-1">
                          {t("guestEmail")}
                        </p>
                        <p className="font-medium text-foreground">
                          {user.email ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/70 mb-1">
                          {t("guestPhone")}
                        </p>
                        <p className="font-medium text-foreground">
                          {user.phone ?? "—"}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("reservationUnderYourAccount")}
                    </p>
                  </div>
                ) : (
                  // Guest form
                  <Form {...form}>
                    <form className="space-y-4">
                      <FormField
                        control={form.control}
                        name="guestName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("guestName")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("guestNamePlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guestEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("guestEmail")}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder={t("guestEmailPlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guestPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("guestPhone")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("guestPhonePlaceholder")}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>{t("paymentMethod")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-wrap mb-4">
                  {(
                    [
                      {
                        id: "presencial" as const,
                        labelKey: "paymentPresencial",
                        icon: DollarSign,
                      },
                      {
                        id: "transferencia" as const,
                        labelKey: "paymentTransferencia",
                        icon: CreditCard,
                      },
                      {
                        id: "otro" as const,
                        labelKey: "paymentOther",
                        icon: Wallet,
                      },
                    ] as const
                  ).map((method) => (
                    <Button
                      key={method.id}
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`flex flex-col items-center gap-1.5 h-auto px-6 py-4 min-w-[120px] ${
                        selectedPaymentMethod === method.id
                          ? "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400"
                          : ""
                      }`}
                    >
                      <method.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">
                        {t(method.labelKey)}
                      </span>
                    </Button>
                  ))}
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-start gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {t("paymentOnSiteNote")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Order summary (sticky) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="bg-teal-600 text-white">
                <CardTitle>{t("orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Field info */}
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {field.name}
                      </h3>
                      {field.sportCenter && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {field.sportCenter.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <Separator className="mb-4" />
                </div>

                {/* Reservation details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/70 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t("date")}
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/70 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t("time")}
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedSlots.length > 0
                        ? `${selectedSlots[0]} - ${selectedSlots[selectedSlots.length - 1]}:00`
                        : "—"}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-foreground">
                    <span>{t("courtRental")}</span>
                    <span>S/ {formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>{t("serviceCharge")}</span>
                    <span>S/ {formatPrice(SERVICE_CHARGE)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg text-foreground pt-2">
                    <span>{t("total")}</span>
                    <span className="text-teal-600">
                      S/ {formatPrice(totalWithService)}
                    </span>
                  </div>
                </div>

                {/* Confirm button */}
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  size="lg"
                  disabled={createReservation.isPending}
                  onClick={
                    user ? onSubmitUser : form.handleSubmit(onSubmitGuest)
                  }
                >
                  {createReservation.isPending
                    ? t("processing")
                    : t("confirmAndReserve")}
                </Button>

                <p className="text-xs text-foreground/70 text-center">
                  {t("termsFooter")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile sticky bottom bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-foreground">{t("total")}</span>
            <span className="text-xl font-bold text-teal-600">
              S/ {formatPrice(totalWithService)}
            </span>
          </div>
          <Button
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            size="lg"
            disabled={createReservation.isPending}
            onClick={user ? onSubmitUser : form.handleSubmit(onSubmitGuest)}
          >
            {createReservation.isPending
              ? t("processing")
              : t("confirmAndReserve")}
          </Button>
        </div>
      </div>
    </div>
  );
}
