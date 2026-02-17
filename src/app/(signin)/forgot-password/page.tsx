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
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { t } = useTranslation("common");

  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors: _errors },
  } = form;

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    clearErrors();
    if (!EMAIL_REGEX.test(data.email)) {
      setError("email", {
        type: "manual",
        message: t("validEmail") || "Ingresa un correo válido",
      });
      toast.error(t("validEmail") || "Ingresa un correo válido");
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
        toast.error(result.message || t("validEmail") || "Correo no válido");
        setError("email", {
          type: "manual",
          message: result.message || t("validEmail") || "Correo no válido",
        });
        return;
      }

      if (!res.ok || !result.success) {
        toast.error(
          result.message ||
            t("networkError") ||
            "Error al enviar el correo. Intenta de nuevo."
        );
        return;
      }

      setEmailSent(true);
      toast.success(
        t("recoveryEmailSent") ??
          "Si el correo está registrado, recibirás un enlace de recuperación."
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
        t("networkError") || "Error de red o servidor. Intenta de nuevo."
      );
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link
              href="/signin"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToSignIn") ??
                t("backToHome") ??
                "Volver al inicio de sesión"}
            </Link>

            <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t("recoveryEmailSentTitle") ?? "Correo enviado"}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t("recoveryEmailSentDescription") ??
                "Hemos enviado un enlace de recuperación a tu correo. Revisa tu bandeja de entrada y sigue las instrucciones."}
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 shrink-0" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  {t("checkSpamFolder") ??
                    "Si no recibes el email en unos minutos, revisa tu carpeta de spam."}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setEmailSent(false)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {t("sendAnotherEmail") ?? "Enviar otro email"}
              </button>

              <Link
                href="/signin"
                className="w-full block text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {t("backToSignIn") ??
                  t("backToHome") ??
                  "Volver al inicio de sesión"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link
            href="/signin"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToSignIn") ??
              t("backToHome") ??
              "Volver al inicio de sesión"}
          </Link>

          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">CL</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t("forgotPassword") ?? "Recuperar contraseña"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {t("forgotPasswordDescription") ??
              "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800/80 py-8 px-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="email"
                control={control}
                rules={{ required: t("emailRequired") || "Correo requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email") ?? "Correo electrónico"}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
                        className="w-full"
                        disabled={loading}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    <span>{t("sending") ?? "Enviando..."}</span>
                  </>
                ) : (
                  <span>
                    {t("sendRecoveryLink") ?? "Enviar enlace de recuperación"}
                  </span>
                )}
              </button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              ¿Recordaste tu contraseña?{" "}
              <Link
                href="/signin"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                {t("signInHere") ?? "Inicia sesión aquí"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
