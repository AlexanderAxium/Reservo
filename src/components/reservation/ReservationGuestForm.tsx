"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const guestFormSchema = z.object({
  guestName: z.string().min(1, "El nombre es requerido"),
  guestEmail: z.string().email("Email inválido"),
  guestPhone: z.string().min(1, "El teléfono es requerido"),
});

type GuestFormData = z.infer<typeof guestFormSchema>;

interface ReservationGuestFormProps {
  onSubmit: (data: GuestFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  namespace?: "common" | "fields";
}

export function ReservationGuestForm({
  onSubmit,
  onCancel,
  isLoading = false,
  namespace = "common",
}: ReservationGuestFormProps) {
  const { t } = useTranslation(namespace);
  const { user } = useAuthContext();

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      guestName: user?.name ?? "",
      guestEmail: user?.email ?? "",
      guestPhone: user?.phone ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        guestName: user.name ?? "",
        guestEmail: user.email ?? "",
        guestPhone: user.phone ?? "",
      });
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("guestName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("guestNamePlaceholder")} {...field} />
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
                <Input placeholder={t("guestPhonePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("reserving") : t("completeReservation")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
