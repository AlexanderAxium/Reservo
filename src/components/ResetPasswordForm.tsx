"use client";

import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { REQUEST_TIMEOUT_MS } from "@/constants/time";
import { useTranslation } from "@/hooks/useTranslation";
import { EMAIL_REGEX } from "@/utils/validate";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type ResetPasswordFormValues = { email: string };

export default function ResetPasswordForm({
  onLogin,
}: {
  onLogin: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("common");

  const form = useForm<ResetPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const onSubmit = async (data: ResetPasswordFormValues) => {
    clearErrors();
    if (!EMAIL_REGEX.test(data.email)) {
      setError("email", {
        type: "manual",
        message: t("validEmail") ?? "Ingresa un correo válido",
      });
      toast.error(t("validEmail") ?? "Ingresa un correo válido");
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email.trim().toLowerCase() }),
        signal: controller.signal,
      });
      const result = await res.json();

      if (result.code === "NOT_REGISTERED") {
        toast.error(
          t("emailNotRegistered") ??
            "No hay ninguna cuenta registrada con este correo."
        );
        setError("email", {
          type: "manual",
          message:
            t("emailNotRegistered") ??
            "No hay ninguna cuenta registrada con este correo.",
        });
        return;
      }

      if (result.code === "INVALID_EMAIL" || res.status === 400) {
        toast.error(result.message ?? t("validEmail") ?? "Correo no válido");
        setError("email", {
          type: "manual",
          message: result.message ?? t("validEmail") ?? "Correo no válido",
        });
        return;
      }

      if (!res.ok || !result.success) {
        toast.error(
          result.message ??
            t("networkError") ??
            "Error al enviar. Intenta de nuevo."
        );
        return;
      }

      toast.success(
        t("recoveryEmailSent") ??
          "Si el correo está registrado, recibirás instrucciones."
      );
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        toast.error(
          t("networkError") ??
            "La solicitud tardó demasiado. Comprueba tu conexión e intenta de nuevo."
        );
        return;
      }
      toast.error(
        t("networkError") ?? "Error de red o servidor. Intenta de nuevo."
      );
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-bold text-center">
          {t("forgotPassword") ?? "Restablecer contraseña"}
        </h2>
        <Controller
          name="email"
          control={control}
          rules={{
            required: t("emailRequired") ?? "Correo requerido",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email") ?? "Correo electrónico"}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  {...field}
                  disabled={loading}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errors.email?.message && (
          <div className="text-destructive text-sm">{errors.email.message}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-yellow-500 via-orange-400 to-red-400 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              <span>{t("sending") ?? "Enviando..."}</span>
            </>
          ) : (
            <span>{t("sendRecoveryLink") ?? "Enviar instrucciones"}</span>
          )}
        </button>
        <div className="flex justify-center text-sm mt-2">
          <button
            type="button"
            className="text-indigo-600 hover:underline"
            onClick={onLogin}
          >
            {t("backToSignIn") ?? t("backToHome") ?? "Volver a login"}
          </button>
        </div>
      </form>
    </Form>
  );
}
